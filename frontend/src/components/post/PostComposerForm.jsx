import { ImagePlus, Sparkles } from "lucide-react";
import { useState } from "react";
import Button from "../ui/Button.jsx";
import Input from "../ui/Input.jsx";
import Textarea from "../ui/Textarea.jsx";

const initialState = {
  title: "",
  description: "",
  category: "",
  tags: "",
};

function PostComposerForm({ onSubmit, isSubmitting }) {
  const [form, setForm] = useState(initialState);
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState("");

  const handleChange = (event) => {
    setForm((previous) => ({
      ...previous,
      [event.target.name]: event.target.value,
    }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    const formData = new FormData();

    Object.entries(form).forEach(([key, value]) => formData.append(key, value));
    if (image) {
      formData.append("image", image);
    }

    onSubmit(formData, () => {
      setForm(initialState);
      setImage(null);
    });
  };

  const handleImageChange = (event) => {
    const nextFile = event.target.files?.[0] || null;
    setImage(nextFile);
    setPreview(nextFile ? URL.createObjectURL(nextFile) : "");
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 rounded-[2.25rem] border border-white/70 bg-white/90 p-5 soft-shadow sm:p-6">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-xs uppercase tracking-[0.24em] text-rose-500">Compose</p>
          <h2 className="mt-2 text-2xl font-semibold tracking-tight text-slate-950">Publish a premium visual story</h2>
        </div>
        <div className="hidden rounded-full bg-rose-50 p-3 text-rose-500 sm:block">
          <Sparkles size={18} />
        </div>
      </div>
      <Input label="Title" name="title" value={form.title} onChange={handleChange} placeholder="Nordic kitchen moodboard" />
      <Textarea label="Description" name="description" value={form.description} onChange={handleChange} placeholder="Describe what makes this pin worth saving." />
      <div className="grid gap-4 sm:grid-cols-2">
        <Input label="Category" name="category" value={form.category} onChange={handleChange} placeholder="Interior" />
        <Input label="Tags" name="tags" value={form.tags} onChange={handleChange} placeholder="neutral, oak, minimal" />
      </div>
      <label className="group flex min-h-44 cursor-pointer flex-col items-center justify-center overflow-hidden rounded-[2rem] border border-dashed border-slate-300 bg-slate-50/80 px-6 text-center transition hover:border-rose-300 hover:bg-white">
        {preview ? (
          <div className="w-full">
            <img src={preview} alt="Preview" className="max-h-[26rem] w-full rounded-[1.6rem] object-cover" />
          </div>
        ) : (
          <>
            <div className="rounded-full bg-white p-4 text-rose-500 shadow-sm transition group-hover:scale-105">
              <ImagePlus size={22} />
            </div>
            <span className="mt-4 text-sm font-medium text-slate-700">
              {image ? image.name : "Tap to upload a cover image"}
            </span>
            <span className="mt-2 text-xs text-slate-400">JPG, PNG or WEBP up to 5MB</span>
          </>
        )}
        <input type="file" accept="image/*" className="hidden" onChange={handleImageChange} />
      </label>
      <Button type="submit" variant="accent" className="w-full bg-gradient-to-r from-rose-500 to-orange-400 shadow-lg shadow-rose-500/30" disabled={isSubmitting}>
        {isSubmitting ? "Publishing..." : "Publish pin"}
      </Button>
    </form>
  );
}

export default PostComposerForm;
