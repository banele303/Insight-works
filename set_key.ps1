# Sets JWT_PRIVATE_KEY from a local file (private_key.pem) — never commit the key itself.
# Usage: powershell -File set_key.ps1
param(
    [string]$KeyFile = "private_key.pem"
)

if (-not (Test-Path $KeyFile)) {
    Write-Error "Key file not found: $KeyFile. Generate one with: node update_env.mjs or openssl genpkey -algorithm RSA -out private_key.pem"
    exit 1
}

$privateKey = Get-Content $KeyFile -Raw

# Sanitize for single-line env storage
$privateKey = $privateKey.Trim().Replace("`n", " ").Replace("`r", " ")

bun x convex env set JWT_PRIVATE_KEY -- "$privateKey"
if ($LASTEXITCODE -eq 0) {
    Write-Host "Success! JWT_PRIVATE_KEY set from $KeyFile"
}
