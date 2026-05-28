import { motion } from "framer-motion";
import { Bookmark, Heart, MessageCircle, Trash2 } from "lucide-react";
import { Link } from "react-router-dom";
import useAuth from "../../hooks/useAuth.js";
import { getOptimizedImage } from "../../utils/cloudinary.js";
import { formatCompactNumber } from "../../utils/formatters.js";

function PostCard({
  post,
  onLike,
  onSave,
  isAuthenticated,
  showDeleteAction = false,
  onDelete,
}) {
  const { user } = useAuth();
  const currentUserId = user?._id;
  const isLikedByCurrentUser = post.likes?.some(
    (userId) => String(userId) === String(currentUserId)
  );
  const isSavedByCurrentUser = post.saves?.some(
    (userId) => String(userId) === String(currentUserId)
  );

  return (
    <motion.div
      layout
      whileHover={{ y: -6 }}
      transition={{ duration: 0.24, ease: "easeOut" }}
      className="group overflow-hidden rounded-[2rem] border border-white/70 bg-white/95 soft-shadow"
    >
      <Link to={`/posts/${post._id}`} className="relative block overflow-hidden">
        <img
          src={getOptimizedImage(post.image, 700)}
          alt={post.title}
          className="h-full w-full object-cover transition duration-500 group-hover:scale-[1.04]"
          loading="lazy"
        />
        <div className="pointer-events-none absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-slate-950/20 via-slate-950/0 to-transparent opacity-0 transition duration-300 group-hover:opacity-100" />
      </Link>
      <div className="space-y-3 p-4 sm:p-4">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <h3 className="line-clamp-1 text-base font-semibold text-slate-900">{post.title}</h3>
            <p className="mt-1 text-sm text-slate-500">{post.category}</p>
          </div>
          <div className="flex items-center gap-2">
            <span className="shrink-0 rounded-full bg-rose-50 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.18em] text-rose-500">
              {post.tags?.[0] || "curated"}
            </span>
            {showDeleteAction && (
              <button
                type="button"
                onClick={() => onDelete?.(post)}
                className="rounded-full p-2 text-slate-400 transition hover:bg-rose-50 hover:text-rose-500"
                aria-label={`Delete ${post.title}`}
              >
                <Trash2 size={16} />
              </button>
            )}
          </div>
        </div>
        <div className="flex items-center justify-between gap-3">
          <div className="flex min-w-0 items-center gap-2">
            <img
              src={post.user?.profileImage}
              alt={post.user?.username}
              className="h-9 w-9 shrink-0 rounded-full object-cover"
            />
            <div className="min-w-0">
              <p className="truncate text-sm font-medium text-slate-800">{post.user?.username}</p>
              <p className="line-clamp-1 text-xs text-slate-500">{post.description}</p>
            </div>
          </div>
          {isAuthenticated && (
            <div className="flex shrink-0 items-center gap-1 text-slate-500">
              <button
                type="button"
                onClick={() => onLike(post._id)}
                className={`rounded-full p-2 transition ${
                  isLikedByCurrentUser
                    ? "bg-rose-50 text-rose-500"
                    : "hover:bg-rose-50 hover:text-rose-500"
                }`}
              >
                <Heart size={17} className={isLikedByCurrentUser ? "fill-current" : ""} />
              </button>
              <button
                type="button"
                onClick={() => onSave(post._id)}
                className={`rounded-full p-2 transition ${
                  isSavedByCurrentUser
                    ? "bg-sky-50 text-sky-600"
                    : "hover:bg-sky-50 hover:text-sky-600"
                }`}
              >
                <Bookmark size={17} className={isSavedByCurrentUser ? "fill-current" : ""} />
              </button>
            </div>
          )}
        </div>
        <div className="flex items-center gap-4 border-t border-slate-100 pt-1 text-xs text-slate-500">
          <span className="flex items-center gap-1">
            <Heart size={14} />
            {formatCompactNumber(post.likes?.length)}
          </span>
          <span className="flex items-center gap-1">
            <MessageCircle size={14} />
            {formatCompactNumber(post.comments?.length)}
          </span>
        </div>
      </div>
    </motion.div>
  );
}

export default PostCard;
