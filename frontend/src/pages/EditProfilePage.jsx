import { useState } from "react";
import toast from "react-hot-toast";
import useAuth from "../hooks/useAuth.js";
import Button from "../components/ui/Button.jsx";
import Input from "../components/ui/Input.jsx";
import Textarea from "../components/ui/Textarea.jsx";
import { updateProfileRequest } from "../services/userService.js";

function EditProfilePage() {
  const { user, setUser } = useAuth();
  const [form, setForm] = useState({
    username: user?.username || "",
    email: user?.email || "",
    bio: user?.bio || "",
  });
  const [image, setImage] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setSubmitting(true);

    const formData = new FormData();
    Object.entries(form).forEach(([key, value]) => formData.append(key, value));
    if (image) {
      formData.append("profileImage", image);
    }

    try {
      const response = await updateProfileRequest(formData);
      setUser((previous) => ({ ...previous, ...response.user }));
      toast.success(response.message);
    } catch (error) {
      toast.error(error.response?.data?.message || "Unable to update profile.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="mx-auto max-w-2xl space-y-4 rounded-[2.5rem] bg-white p-6 soft-shadow">
      <h1 className="text-3xl font-semibold text-slate-950">Edit profile</h1>
      <Input label="Username" value={form.username} onChange={(event) => setForm({ ...form, username: event.target.value })} />
      <Input label="Email" type="email" value={form.email} onChange={(event) => setForm({ ...form, email: event.target.value })} />
      <Textarea label="Bio" value={form.bio} onChange={(event) => setForm({ ...form, bio: event.target.value })} />
      <label className="block rounded-[1.75rem] border border-dashed border-slate-300 bg-slate-50 p-4 text-sm text-slate-600">
        Upload avatar
        <input type="file" accept="image/*" className="mt-3 block w-full" onChange={(event) => setImage(event.target.files?.[0] || null)} />
      </label>
      <Button type="submit" className="w-full" disabled={submitting}>
        {submitting ? "Saving..." : "Save changes"}
      </Button>
    </form>
  );
}

export default EditProfilePage;
