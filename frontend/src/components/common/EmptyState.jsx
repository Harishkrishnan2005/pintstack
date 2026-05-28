function EmptyState({ title, description }) {
  return (
    <div className="glass-panel rounded-[2rem] border border-white/70 px-6 py-10 text-center soft-shadow">
      <h3 className="text-lg font-semibold text-slate-900">{title}</h3>
      <p className="mt-2 text-sm text-slate-500">{description}</p>
    </div>
  );
}

export default EmptyState;
