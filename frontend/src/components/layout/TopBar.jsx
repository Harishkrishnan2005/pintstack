import { LogOut, Search, SlidersHorizontal } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import useAuth from "../../hooks/useAuth.js";
import Logo from "../common/Logo.jsx";
import Button from "../ui/Button.jsx";

function TopBar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  return (
    <header className="sticky top-0 z-40 px-4 pt-4 sm:px-6">
      <div className="glass-panel soft-shadow flex flex-wrap items-center gap-3 rounded-[2rem] border border-white/60 px-3 py-3 sm:px-4">
        <Link to="/" className="min-w-0 shrink">
          <Logo />
        </Link>
        <button
          type="button"
          onClick={() => navigate("/search")}
          className="order-3 flex min-h-12 w-full items-center gap-3 rounded-full bg-white/80 px-4 text-left text-sm text-slate-400 sm:order-none sm:flex-1"
        >
          <Search size={18} />
          <span className="truncate">Search pins, people, and styles</span>
        </button>
        <button
          type="button"
          className="hidden rounded-full bg-white/80 p-3 text-slate-600 xl:inline-flex"
        >
          <SlidersHorizontal size={18} />
        </button>
        {user ? (
          <div className="ml-auto flex items-center gap-2 sm:gap-3">
            <img
              src={user.profileImage}
              alt={user.username}
              className="h-11 w-11 rounded-full object-cover ring-2 ring-white"
            />
            <Button variant="ghost" onClick={logout} className="px-3 sm:px-5">
              <span className="sm:hidden">
                <LogOut size={16} />
              </span>
              <span className="hidden sm:inline">Logout</span>
            </Button>
          </div>
        ) : (
          <div className="ml-auto hidden items-center gap-2 md:flex">
            <Button variant="ghost" onClick={() => navigate("/login")}>
              Login
            </Button>
            <Button onClick={() => navigate("/register")}>Join now</Button>
          </div>
        )}
      </div>
    </header>
  );
}

export default TopBar;
