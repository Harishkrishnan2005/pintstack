import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { Bookmark, Heart, MessageCircleMore, Send, Sparkles } from "lucide-react";
import { Link, useParams } from "react-router-dom";
import PageLoader from "../components/common/PageLoader.jsx";
import Button from "../components/ui/Button.jsx";
import useAuth from "../hooks/useAuth.js";
import { addCommentRequest, getPostRequest, toggleLikeRequest, toggleSaveRequest } from "../services/postService.js";
import { toggleFollowRequest } from "../services/userService.js";
import { getOptimizedImage } from "../utils/cloudinary.js";
import { formatCompactNumber } from "../utils/formatters.js";

function PostDetailPage() {
  const { id } = useParams();
  const { isAuthenticated, user, setUser } = useAuth();
  const [post, setPost] = useState(null);
  const [comment, setComment] = useState("");
  const [loading, setLoading] = useState(true);
  const [followLoading, setFollowLoading] = useState(false);

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const response = await getPostRequest(id);
        setPost(response.post);
      } catch (error) {
        toast.error(error.response?.data?.message || "Unable to load post.");
      } finally {
        setLoading(false);
      }
    };

    fetchPost();
  }, [id]);

  const handleEngagement = async (action) => {
    if (!isAuthenticated) {
      toast.error("Please sign in first.");
      return;
    }

    try {
      const response = await action(id);
      if (response.post) {
        setPost((previous) => ({ ...previous, ...response.post }));
      }
      if (response.savedPosts) {
        toast.success(response.message);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Action failed.");
    }
  };

  const handleComment = async (event) => {
    event.preventDefault();
    if (!comment.trim()) {
      return;
    }

    try {
      const response = await addCommentRequest(id, { text: comment });
      setPost(response.post);
      setComment("");
      toast.success(response.message);
    } catch (error) {
      toast.error(error.response?.data?.message || "Unable to comment.");
    }
  };

  if (loading) {
    return <PageLoader label="Loading pin detail..." />;
  }

  if (!post) {
    return null;
  }

  const currentUserId = user?._id;
  const isLikedByCurrentUser = post.likes?.some(
    (userId) => String(userId) === String(currentUserId)
  );
  const isSavedByCurrentUser = post.saves?.some(
    (userId) => String(userId) === String(currentUserId)
  );
  const isOwner = String(post.user?._id) === String(currentUserId);
  const isFollowingPostOwner = post.user?.followers?.some(
    (userId) => String(userId) === String(currentUserId)
  );

  const handleFollowToggle = async () => {
    if (!isAuthenticated) {
      toast.error("Please sign in first.");
      return;
    }

    if (isOwner || followLoading) {
      return;
    }

    setFollowLoading(true);
    try {
      const response = await toggleFollowRequest(post.user._id);
      setPost((previous) => ({
        ...previous,
        user: {
          ...previous.user,
          ...response.user,
        },
      }));
      setUser((previous) => (previous ? { ...previous, ...response.currentUser } : previous));
      toast.success(response.message);
    } catch (error) {
      toast.error(error.response?.data?.message || "Unable to update follow status.");
    } finally {
      setFollowLoading(false);
    }
  };

  return (
    <div className="grid gap-6 xl:grid-cols-[1.05fr_0.95fr]">
      <div className="space-y-5">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="overflow-hidden rounded-[2.5rem] border border-white/70 bg-white soft-shadow"
        >
          <img src={getOptimizedImage(post.image, 1200)} alt={post.title} className="w-full object-cover" />
        </motion.div>
        <section className="rounded-[2rem] border border-white/70 bg-white/90 p-5 soft-shadow">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <Link to={`/profile/${post.user?._id}`} className="flex min-w-0 items-center gap-3">
              <img src={post.user?.profileImage} alt={post.user?.username} className="h-14 w-14 rounded-full object-cover" />
              <div className="min-w-0">
                <p className="text-lg font-semibold text-slate-950">{post.user?.username}</p>
                <p className="line-clamp-2 text-sm text-slate-500">{post.user?.bio}</p>
              </div>
            </Link>
            {!isOwner && isAuthenticated && (
              <Button
                variant={isFollowingPostOwner ? "secondary" : "accent"}
                onClick={handleFollowToggle}
                disabled={followLoading}
                className={isFollowingPostOwner ? "" : "bg-gradient-to-r from-rose-500 to-orange-400"}
              >
                {followLoading ? "Updating..." : isFollowingPostOwner ? "Unfollow" : "Follow"}
              </Button>
            )}
          </div>
          <div className="mt-4 grid gap-3 sm:grid-cols-3">
            <div className="rounded-[1.5rem] bg-slate-50 px-4 py-3">
              <p className="text-xs uppercase tracking-[0.22em] text-slate-400">Followers</p>
              <p className="mt-2 text-xl font-semibold text-slate-950">
                {formatCompactNumber(post.user?.followers?.length || 0)}
              </p>
            </div>
            <div className="rounded-[1.5rem] bg-slate-50 px-4 py-3">
              <p className="text-xs uppercase tracking-[0.22em] text-slate-400">Following</p>
              <p className="mt-2 text-xl font-semibold text-slate-950">
                {formatCompactNumber(post.user?.following?.length || 0)}
              </p>
            </div>
            <div className="rounded-[1.5rem] bg-slate-50 px-4 py-3">
              <p className="text-xs uppercase tracking-[0.22em] text-slate-400">Post likes</p>
              <p className="mt-2 text-xl font-semibold text-slate-950">
                {formatCompactNumber(post.likes?.length || 0)}
              </p>
            </div>
          </div>
        </section>
      </div>
      <section className="glass-panel rounded-[2.5rem] border border-white/60 p-5 soft-shadow sm:p-6">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="inline-flex items-center gap-2 rounded-full bg-rose-50 px-3 py-1 text-xs uppercase tracking-[0.24em] text-rose-500">
              <Sparkles size={12} />
              {post.category}
            </p>
            <h1 className="mt-4 text-3xl font-semibold tracking-tight text-slate-950 sm:text-4xl">{post.title}</h1>
            <p className="mt-4 text-sm leading-7 text-slate-500 sm:text-base">{post.description}</p>
          </div>
          <div className="flex gap-2">
            <Button
              variant="ghost"
              onClick={() => handleEngagement(toggleLikeRequest)}
              className={isLikedByCurrentUser ? "bg-rose-50 text-rose-500" : ""}
            >
              <Heart size={18} className={isLikedByCurrentUser ? "fill-current" : ""} />
            </Button>
            <Button
              variant="ghost"
              onClick={() => handleEngagement(toggleSaveRequest)}
              className={isSavedByCurrentUser ? "bg-sky-50 text-sky-600" : ""}
            >
              <Bookmark size={18} className={isSavedByCurrentUser ? "fill-current" : ""} />
            </Button>
          </div>
        </div>
        <div className="mt-6 flex items-center gap-3 rounded-[2rem] bg-white/80 p-4">
          <img src={post.user?.profileImage} alt={post.user?.username} className="h-12 w-12 rounded-full object-cover" />
          <div className="flex-1">
            <p className="font-semibold text-slate-900">{post.user?.username}</p>
            <p className="text-sm text-slate-500">{formatCompactNumber(post.likes?.length)} likes • curated visual post</p>
          </div>
        </div>
        <div className="mt-6 grid gap-4 sm:grid-cols-3">
          <div className="rounded-[1.75rem] bg-white/75 p-4">
            <p className="text-xs uppercase tracking-[0.22em] text-slate-400">Likes</p>
            <p className="mt-2 text-2xl font-semibold text-slate-950">{formatCompactNumber(post.likes?.length)}</p>
          </div>
          <div className="rounded-[1.75rem] bg-white/75 p-4">
            <p className="text-xs uppercase tracking-[0.22em] text-slate-400">Comments</p>
            <p className="mt-2 text-2xl font-semibold text-slate-950">{formatCompactNumber(post.comments?.length)}</p>
          </div>
          <div className="rounded-[1.75rem] bg-white/75 p-4">
            <p className="text-xs uppercase tracking-[0.22em] text-slate-400">Saves</p>
            <p className="mt-2 text-2xl font-semibold text-slate-950">{formatCompactNumber(post.saves?.length)}</p>
          </div>
        </div>
        <div className="mt-6">
          <div className="mb-4 flex flex-wrap gap-2">
            {post.tags?.map((tag) => (
              <span key={tag} className="rounded-full bg-slate-950 px-3 py-1 text-xs font-medium text-white">
                #{tag}
              </span>
            ))}
          </div>
          <form onSubmit={handleComment} className="flex gap-3">
            <input
              value={comment}
              onChange={(event) => setComment(event.target.value)}
              placeholder="Write a thoughtful comment"
              className="min-h-12 flex-1 rounded-full bg-white px-4 outline-none shadow-sm"
            />
            <Button type="submit" variant="accent" className="bg-gradient-to-r from-rose-500 to-orange-400">
              <Send size={16} />
            </Button>
          </form>
          <div className="mt-6 flex items-center gap-2">
            <MessageCircleMore size={18} className="text-slate-400" />
            <h3 className="text-lg font-semibold text-slate-950">Conversation</h3>
          </div>
          <div className="mt-4 space-y-3">
            {post.comments?.map((item) => (
              <div key={item._id} className="rounded-[1.5rem] bg-white/80 p-4">
                <div className="flex items-center gap-3">
                  <img src={item.user?.profileImage} alt={item.user?.username} className="h-9 w-9 rounded-full object-cover" />
                  <div>
                    <p className="text-sm font-semibold text-slate-900">{item.user?.username}</p>
                    <p className="text-sm text-slate-500">{item.text}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}

export default PostDetailPage;
