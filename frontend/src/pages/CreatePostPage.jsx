import { motion } from "framer-motion";
import { LayoutTemplate, Sparkles, UploadCloud } from "lucide-react";
import { useState } from "react";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import PostComposerForm from "../components/post/PostComposerForm.jsx";
import { createPostRequest } from "../services/postService.js";

function CreatePostPage() {
  const navigate = useNavigate();
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (formData, reset) => {
    setSubmitting(true);
    try {
      const response = await createPostRequest(formData);
      toast.success(response.message);
      reset();
      navigate(`/posts/${response.post._id}`);
    } catch (error) {
      toast.error(error.response?.data?.message || "Unable to publish post.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      <motion.section
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass-panel overflow-hidden rounded-[2.3rem] border border-white/60 p-5 soft-shadow sm:p-6"
      >
        <div className="grid gap-4 xl:grid-cols-[minmax(0,1fr)_360px] xl:items-end">
          <div>
            <p className="text-xs uppercase tracking-[0.28em] text-sky-500">Creator studio</p>
            <h1 className="mt-3 text-4xl font-semibold tracking-tight text-slate-950 sm:text-5xl">
              Craft a post that looks like it belongs on a premium platform.
            </h1>
            <p className="mt-3 max-w-2xl text-sm leading-7 text-slate-500">
              Use the live image preview, polished metadata form, and mobile-first layout to publish content that feels editorial.
            </p>
          </div>
          <div className="grid gap-3 sm:grid-cols-3 xl:grid-cols-1">
            <div className="rounded-[1.75rem] bg-slate-950 p-4 text-white">
              <UploadCloud size={18} className="text-rose-300" />
              <p className="mt-4 text-lg font-semibold">Live preview</p>
              <p className="mt-2 text-sm text-white/65">Instantly see the hero image before upload.</p>
            </div>
            <div className="rounded-[1.75rem] bg-white/80 p-4">
              <Sparkles size={18} className="text-amber-500" />
              <p className="mt-4 text-lg font-semibold text-slate-950">Premium inputs</p>
              <p className="mt-2 text-sm text-slate-500">Cleaner composition flow for creators.</p>
            </div>
            <div className="rounded-[1.75rem] bg-sky-50 p-4">
              <LayoutTemplate size={18} className="text-sky-500" />
              <p className="mt-4 text-lg font-semibold text-slate-950">Mobile-first</p>
              <p className="mt-2 text-sm text-slate-500">Designed to feel natural on touch screens.</p>
            </div>
          </div>
        </div>
      </motion.section>
      <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_350px]">
        <PostComposerForm onSubmit={handleSubmit} isSubmitting={submitting} />
        <aside className="glass-panel rounded-[2.2rem] border border-white/60 p-5 soft-shadow">
          <p className="text-xs uppercase tracking-[0.28em] text-sky-500">Publishing tips</p>
          <h2 className="mt-3 text-2xl font-semibold tracking-tight text-slate-950">Build interview-ready content</h2>
          <ul className="mt-5 space-y-4 text-sm leading-7 text-slate-500">
            <li>Use descriptive titles and intent-driven categories.</li>
            <li>Upload crisp vertical images for better masonry rhythm.</li>
            <li>Add searchable tags to improve discovery and filtering.</li>
            <li>Write captions with enough personality to feel like a real creator platform.</li>
          </ul>
        </aside>
      </div>
    </div>
  );
}

export default CreatePostPage;
