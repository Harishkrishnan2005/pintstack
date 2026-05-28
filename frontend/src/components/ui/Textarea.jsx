function Textarea({ label, className = "", ...props }) {
  return (
    <label className="flex w-full flex-col gap-2 text-sm font-medium text-slate-700">
      <span>{label}</span>
      <textarea
        className={`min-h-28 rounded-3xl border border-white/70 bg-white/80 px-4 py-3 text-slate-900 outline-none placeholder:text-slate-400 focus:border-rose-200 focus:bg-white ${className}`}
        {...props}
      />
    </label>
  );
}

export default Textarea;
