import { Link } from "react-router";

type SchoolBrandProps = {
  to?: string;
  compact?: boolean;
};

export function SchoolBrand({ to = "/", compact = false }: SchoolBrandProps) {
  const content = (
    <div className="flex items-center gap-4">
      <img
        src="/logo-school.jpeg"
        alt="Glenanda Learning Center"
        className={`${compact ? "h-10 w-auto" : "h-18 w-auto"} rounded-xl shadow-lg border border-white/10`}
      />
      {!compact && (
        <div className="flex flex-col">
          <span className="font-black tracking-tight text-gray-900 dark:text-white text-2xl leading-none font-serif">
            Glenanda
          </span>
          <span className="text-[10px] font-bold text-sky-400 dark:text-sky-300 uppercase tracking-[0.25em] mt-1 leading-none">
            Learning Centre
          </span>
        </div>
      )}
    </div>
  );

  if (!to) {
    return <div>{content}</div>;
  }

  return <Link to={to}>{content}</Link>;
}
