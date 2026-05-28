import { NavLink } from "react-router-dom";
import { navigationItems } from "../../constants/navigation.js";
import useAuth from "../../hooks/useAuth.js";

function BottomNav() {
  const { user } = useAuth();

  return (
    <nav className="glass-panel fixed inset-x-3 bottom-3 z-50 rounded-[1.75rem] border border-white/70 px-2 py-2 shadow-2xl shadow-slate-900/10 lg:hidden">
      <div className="grid grid-cols-5 gap-1">
        {navigationItems.map((item) => {
          const Icon = item.icon;
          const path = item.path === "/profile/me" ? `/profile/${user?._id || "me"}` : item.path;

          return (
            <NavLink
              key={item.label}
              to={path}
              className={({ isActive }) =>
                `flex flex-col items-center justify-center rounded-[1.15rem] px-1.5 py-3 text-[10px] font-medium sm:text-[11px] ${
                  isActive ? "bg-slate-950 text-white" : "text-slate-500"
                }`
              }
            >
              <Icon size={18} />
              <span className="mt-1">{item.label}</span>
            </NavLink>
          );
        })}
      </div>
    </nav>
  );
}

export default BottomNav;
