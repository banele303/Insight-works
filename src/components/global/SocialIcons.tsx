import React from "react";

export interface SocialLink {
  name: "Twitter" | "Facebook" | "Linkedin" | "Instagram" | "Tiktok" | "Whatsapp";
  label: string;
  href: string;
  icon: (props: React.SVGProps<SVGSVGElement>) => React.JSX.Element;
  hoverColor?: string;
}

export const TwitterIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg
    viewBox="0 0 24 24"
    fill="currentColor"
    aria-hidden="true"
    {...props}
  >
    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
  </svg>
);

export const FacebookIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg
    viewBox="0 0 24 24"
    fill="currentColor"
    aria-hidden="true"
    {...props}
  >
    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
  </svg>
);

export const LinkedinIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg
    viewBox="0 0 24 24"
    fill="currentColor"
    aria-hidden="true"
    {...props}
  >
    <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
  </svg>
);

export const InstagramIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg
    viewBox="0 0 24 24"
    fill="currentColor"
    aria-hidden="true"
    {...props}
  >
    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.13-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
  </svg>
);

export const TiktokIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg
    viewBox="0 0 24 24"
    fill="currentColor"
    aria-hidden="true"
    {...props}
  >
    <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64c.298-.002.595.042.88.13V9.4a6.33 6.33 0 0 0-1-.08A6.34 6.34 0 0 0 3 15.66a6.34 6.34 0 0 0 10.86 4.43c.01-.01.02-.02.03-.03V11.2a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-.07-2.63z" />
  </svg>
);

export const WhatsappIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg
    viewBox="0 0 24 24"
    fill="currentColor"
    aria-hidden="true"
    {...props}
  >
    <path d="M17.472 14.382c-.301-.15-1.78-.878-2.056-.979-.276-.1-.476-.15-.677.15-.2.3-.777.979-.952 1.18-.175.2-.351.226-.652.076-.301-.15-1.272-.469-2.424-1.496-.895-.798-1.5-1.784-1.675-2.084-.175-.3-.019-.463.132-.613.136-.135.301-.351.451-.527.15-.176.2-.301.3-.502.101-.2.05-.376-.025-.526-.075-.15-.677-1.633-.928-2.237-.245-.588-.494-.509-.677-.518-.176-.008-.376-.01-.576-.01s-.527.076-.803.376c-.276.3-1.053 1.028-1.053 2.507s1.078 2.908 1.228 3.109c.15.2 2.122 3.24 5.141 4.542.718.31 1.279.495 1.716.634.721.229 1.377.197 1.896.119.579-.088 1.78-.727 2.03-1.43.25-.703.25-1.305.175-1.43-.075-.125-.276-.2-.576-.35zM12.04 2c-5.523 0-10 4.477-10 10 0 1.77.46 3.433 1.263 4.88L2 22l5.247-1.264C8.67 21.492 10.3 22 12.04 22c5.523 0 10-4.477 10-10s-4.477-10-10-10z" />
  </svg>
);

export const SOCIAL_PLATFORMS: SocialLink[] = [
  {
    name: "Twitter",
    label: "Follow us on Twitter / X",
    href: "https://twitter.com",
    icon: TwitterIcon,
    hoverColor: "hover:bg-black hover:text-white hover:border-black",
  },
  {
    name: "Facebook",
    label: "Connect with us on Facebook",
    href: "https://facebook.com",
    icon: FacebookIcon,
    hoverColor: "hover:bg-[#1877F2] hover:text-white hover:border-[#1877F2]",
  },
  {
    name: "Linkedin",
    label: "Connect with us on LinkedIn",
    href: "https://linkedin.com",
    icon: LinkedinIcon,
    hoverColor: "hover:bg-[#0A66C2] hover:text-white hover:border-[#0A66C2]",
  },
  {
    name: "Instagram",
    label: "Follow us on Instagram",
    href: "https://instagram.com/insightworks_therapy",
    icon: InstagramIcon,
    hoverColor: "hover:bg-[#E4405F] hover:text-white hover:border-[#E4405F]",
  },
  {
    name: "Tiktok",
    label: "Watch our clips on TikTok",
    href: "https://tiktok.com/@insightworks_therapy",
    icon: TiktokIcon,
    hoverColor: "hover:bg-black hover:text-white hover:border-black",
  },
  {
    name: "Whatsapp",
    label: "Chat with us on WhatsApp",
    href: "https://wa.me/27795501557?text=Hello%20Insight%20Works,%20I%20would%20like%20to%20inquire%20about%20your%20services.",
    icon: WhatsappIcon,
    hoverColor: "hover:bg-[#25D366] hover:text-white hover:border-[#25D366]",
  },
];

interface SocialLinksProps {
  className?: string;
  itemClassName?: string;
  iconClassName?: string;
  platforms?: Array<"Twitter" | "Facebook" | "Linkedin" | "Instagram" | "Tiktok" | "Whatsapp">;
  variant?: "brand" | "colored" | "outline";
}

export const SocialLinks: React.FC<SocialLinksProps> = ({
  className = "flex items-center gap-2",
  itemClassName = "w-9 h-9 rounded-xl bg-white border border-slate-200/80 flex items-center justify-center text-slate-600 shadow-2xs hover:bg-[#156e52] hover:text-white hover:border-[#156e52] transition-all cursor-pointer",
  iconClassName = "w-4 h-4",
  platforms,
  variant,
}) => {
  const filtered = platforms
    ? SOCIAL_PLATFORMS.filter((p) => platforms.includes(p.name))
    : SOCIAL_PLATFORMS;

  return (
    <div className={className}>
      {filtered.map((item) => {
        const Icon = item.icon;
        const customHover = variant === "colored" && item.hoverColor ? item.hoverColor : "";
        return (
          <a
            key={item.name}
            href={item.href}
            target="_blank"
            rel="noreferrer"
            className={`${itemClassName} ${customHover}`}
            aria-label={item.label}
            title={item.name}
          >
            <Icon className={iconClassName} />
          </a>
        );
      })}
    </div>
  );
};

export default SocialLinks;
