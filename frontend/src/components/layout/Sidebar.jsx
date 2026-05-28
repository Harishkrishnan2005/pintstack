import { NavLink } from "react-router-dom";
import { navigationItems } from "../../constants/navigation.js";
import useAuth from "../../hooks/useAuth.js";
import { cn } from "../../utils/cn.js";
import { categories } from "../../constants/categories.js";

function Sidebar() {
  const { user } = useAuth();

  return (
    <aside className="glass-panel soft-shadow sticky top-28 hidden h-fit overflow-hidden rounded-[2.2rem] border border-white/60 p-4 lg:block">
      <div className="absolute inset-x-0 top-0 h-24 bg-gradient-to-r from-rose-200/40 via-transparent to-sky-200/40" />
      <div className="relative mb-6 rounded-[1.9rem] bg-slate-950 p-5 text-white">
        <p className="text-xs uppercase tracking-[0.24em] text-white/60">Workspace</p>
        <h2 className="mt-2 text-2xl font-semibold tracking-tight">Design vault</h2>
        <p className="mt-3 text-sm leading-7 text-white/70">
          Mobile-first inspiration boards with tenant-aware architecture and premium creator vibes.
        </p>
        <div className="mt-5 grid grid-cols-2 gap-3 text-xs">
          <div className="rounded-2xl bg-white/10 px-3 py-3">
            <p className="text-white/55">Posts</p>
            <p className="mt-1 text-lg font-semibold">Fresh</p>
          </div>
          <div className="rounded-2xl bg-white/10 px-3 py-3">
            <p className="text-white/55">Style</p>
            <p className="mt-1 text-lg font-semibold">Premium</p>
          </div>
        </div>
      </div>
      <nav className="relative space-y-2">
        {navigationItems.map((item) => {
          const Icon = item.icon;
          const path = item.path === "/profile/me" ? `/profile/${user?._id || "me"}` : item.path;

          return (
            <NavLink
              key={item.label}
              to={path}
              className={({ isActive }) =>
                cn(
                  "flex items-center gap-3 rounded-full px-4 py-3 text-sm font-medium transition duration-200",
                  isActive
                    ? "bg-gradient-to-r from-rose-500 to-orange-400 text-white shadow-lg shadow-rose-500/30"
                    : "text-slate-600 hover:bg-white/80 hover:text-slate-900"
                )
              }
            >
              <Icon size={18} />
              {item.label}
            </NavLink>
          );
        })}
      </nav>
      <div className="relative mt-6 border-t border-slate-200/70 pt-5">
        <p className="mb-3 text-xs font-semibold uppercase tracking-[0.22em] text-slate-400">
          Trending boards
        </p>
        <div className="flex flex-wrap gap-2">
          {categories.slice(0, 6).map((category, index) => (
            <span
              key={category}
              className={cn(
                "rounded-full px-3 py-2 text-xs font-medium",
                index % 2 === 0 ? "bg-rose-50 text-rose-600" : "bg-sky-50 text-sky-600"
              )}
            >
              {category}
            </span>
          ))}
        </div>
      </div>
    </aside>
  );
}

export default Sidebar;
