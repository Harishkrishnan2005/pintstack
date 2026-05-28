function PageLoader({ label = "Loading inspiration..." }) {
  return (
    <div className="flex min-h-[40vh] items-center justify-center">
      <div className="glass-panel soft-shadow rounded-[2rem] px-6 py-5 text-sm font-medium text-slate-600">
        {label}
      </div>
    </div>
  );
}

export default PageLoader;
