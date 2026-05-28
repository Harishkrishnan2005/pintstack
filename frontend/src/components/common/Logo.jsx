function Logo() {
  return (
    <div className="flex items-center gap-3">
      <div className="grid h-10 w-10 shrink-0 place-items-center rounded-2xl bg-rose-500 text-lg font-bold text-white shadow-lg shadow-rose-500/30 sm:h-11 sm:w-11">
        P
      </div>
      <div className="min-w-0">
        <p className="truncate text-xs font-semibold uppercase tracking-[0.28em] text-rose-500 sm:text-sm">
          PinStack
        </p>
        <p className="hidden text-sm text-slate-500 sm:block">Curate ideas beautifully</p>
      </div>
    </div>
  );
}

export default Logo;
