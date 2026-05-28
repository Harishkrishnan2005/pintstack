import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import useAuth from "../hooks/useAuth.js";
import Button from "../components/ui/Button.jsx";
import Input from "../components/ui/Input.jsx";

function RegisterPage() {
  const navigate = useNavigate();
  const { register } = useAuth();
  const [form, setForm] = useState({ username: "", email: "", password: "" });
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setSubmitting(true);
    try {
      await register(form);
      navigate("/");
    } catch (error) {
      toast.error(error.response?.data?.message || "Unable to register.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="mx-auto max-w-md rounded-[2.5rem] bg-white p-6 soft-shadow">
      <p className="text-xs uppercase tracking-[0.28em] text-sky-500">Create account</p>
      <h1 className="mt-3 text-3xl font-semibold text-slate-950">Start building your visual vault</h1>
      <form className="mt-6 space-y-4" onSubmit={handleSubmit}>
        <Input label="Username" value={form.username} onChange={(event) => setForm({ ...form, username: event.target.value })} />
        <Input label="Email" type="email" value={form.email} onChange={(event) => setForm({ ...form, email: event.target.value })} />
        <Input label="Password" type="password" value={form.password} onChange={(event) => setForm({ ...form, password: event.target.value })} />
        <Button type="submit" className="w-full" disabled={submitting}>
          {submitting ? "Creating account..." : "Register"}
        </Button>
      </form>
      <p className="mt-5 text-sm text-slate-500">
        Already have an account? <Link to="/login" className="font-semibold text-rose-500">Login</Link>
      </p>
    </div>
  );
}

export default RegisterPage;
