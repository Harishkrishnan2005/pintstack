function Input({ label, className = "", ...props }) {
  return (
    <label className="flex w-full flex-col gap-2 text-sm font-medium text-slate-700">
      <span>{label}</span>
      <input
        className={`min-h-12 rounded-2xl border border-white/70 bg-white/80 px-4 text-slate-900 outline-none ring-0 placeholder:text-slate-400 focus:border-rose-200 focus:bg-white ${className}`}
        {...props}
      />
    </label>
  );
}

export default Input;
