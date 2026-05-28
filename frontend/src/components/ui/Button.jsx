import { cn } from "../../utils/cn.js";

function Button({
  children,
  className,
  variant = "primary",
  type = "button",
  ...props
}) {
  const variants = {
    primary:
      "bg-slate-950 text-white shadow-lg shadow-slate-950/20 hover:bg-slate-800",
    secondary:
      "bg-white/80 text-slate-900 ring-1 ring-slate-200 hover:bg-white",
    ghost:
      "bg-transparent text-slate-700 hover:bg-white/70",
    accent:
      "bg-rose-500 text-white shadow-lg shadow-rose-500/30 hover:bg-rose-400",
  };

  return (
    <button
      type={type}
      className={cn(
        "inline-flex min-h-11 items-center justify-center rounded-full px-5 text-sm font-semibold transition duration-200",
        variants[variant],
        className
      )}
      {...props}
    >
      {children}
    </button>
  );
}

export default Button;
