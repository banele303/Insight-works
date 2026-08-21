import { Link } from "react-router";

type SchoolBrandProps = {
  to?: string;
  compact?: boolean;
};

export function SchoolBrand({ to = "/", compact = false }: SchoolBrandProps) {
  const content = (
    <div className="flex items-center gap-3.5">
      <img
        src="/images/logo.png"
        alt="Insight Works Therapy & Coaching"
        className={`${compact ? "h-12 w-auto" : "h-16 w-auto"} object-contain rounded-md`}
      />
      {!compact && (
        <div className="flex flex-col">
          <span className="font-black tracking-tight text-[#0f2820] dark:text-white text-xl leading-none font-serif">
            Insight Works
          </span>
          <span className="text-[10px] font-bold text-[#156e52] dark:text-emerald-400 uppercase tracking-[0.2em] mt-1 leading-none">
            Therapy & Coaching
          </span>
        </div>
      )}
    </div>
  );

  if (!to) {
    return <div>{content}</div>;
  }

  return <Link to={to} className="cursor-pointer">{content}</Link>;
}
