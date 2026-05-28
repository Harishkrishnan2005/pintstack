import { Link } from "react-router-dom";
import Button from "../components/ui/Button.jsx";

function NotFoundPage() {
  return (
    <div className="mx-auto max-w-xl rounded-[2.5rem] bg-white p-8 text-center soft-shadow">
      <p className="text-xs uppercase tracking-[0.28em] text-rose-500">404</p>
      <h1 className="mt-3 text-4xl font-semibold text-slate-950">This board doesn&apos;t exist</h1>
      <p className="mt-3 text-sm text-slate-500">
        The page you requested has been moved, removed, or never published.
      </p>
      <Link to="/" className="mt-6 inline-block">
        <Button>Back to home</Button>
      </Link>
    </div>
  );
}

export default NotFoundPage;
