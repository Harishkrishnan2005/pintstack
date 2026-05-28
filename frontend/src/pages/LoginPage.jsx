import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import useAuth from "../hooks/useAuth.js";
import Button from "../components/ui/Button.jsx";
import Input from "../components/ui/Input.jsx";

function LoginPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useAuth();
  const [form, setForm] = useState({ email: "", password: "" });
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setSubmitting(true);
    try {
      await login(form);
      navigate(location.state?.from || "/");
    } catch (error) {
      toast.error(error.response?.data?.message || "Unable to sign in.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="mx-auto max-w-md rounded-[2.5rem] bg-white p-6 soft-shadow">
      <p className="text-xs uppercase tracking-[0.28em] text-rose-500">Welcome back</p>
      <h1 className="mt-3 text-3xl font-semibold text-slate-950">Sign in to your boards</h1>
      <form className="mt-6 space-y-4" onSubmit={handleSubmit}>
        <Input label="Email" type="email" value={form.email} onChange={(event) => setForm({ ...form, email: event.target.value })} />
        <Input label="Password" type="password" value={form.password} onChange={(event) => setForm({ ...form, password: event.target.value })} />
        <Button type="submit" variant="accent" className="w-full" disabled={submitting}>
          {submitting ? "Signing in..." : "Login"}
        </Button>
      </form>
      <p className="mt-5 text-sm text-slate-500">
        New here? <Link to="/register" className="font-semibold text-rose-500">Create an account</Link>
      </p>
    </div>
  );
}

export default LoginPage;
