import BottomNav from "../components/layout/BottomNav.jsx";
import Sidebar from "../components/layout/Sidebar.jsx";
import TopBar from "../components/layout/TopBar.jsx";

function AppShell({ children }) {
  return (
    <div className="min-h-screen overflow-x-hidden pb-28 lg:pb-8">
      <TopBar />
      <main className="mx-auto grid w-full max-w-[1440px] gap-5 px-4 py-5 sm:px-6 lg:grid-cols-[260px_minmax(0,1fr)] lg:gap-6 lg:py-6">
        <Sidebar />
        <div className="min-w-0">{children}</div>
      </main>
      <BottomNav />
    </div>
  );
}

export default AppShell;
