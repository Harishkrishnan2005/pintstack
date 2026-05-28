import { motion } from "framer-motion";
import { Flame, Sparkles, TrendingUp, Wand2 } from "lucide-react";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import CategoryChips from "../components/feed/CategoryChips.jsx";
import FeedSkeleton from "../components/feed/FeedSkeleton.jsx";
import MasonryFeed from "../components/feed/MasonryFeed.jsx";
import { categories } from "../constants/categories.js";
import useAuth from "../hooks/useAuth.js";
import useInfiniteScroll from "../hooks/useInfiniteScroll.js";
import { getPostsRequest, toggleLikeRequest, toggleSaveRequest } from "../services/postService.js";

function HomePage() {
  const { isAuthenticated } = useAuth();
  const [posts, setPosts] = useState([]);
  const [page, setPage] = useState(1);
  const [meta, setMeta] = useState({ hasMore: true });
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState("");

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const response = await getPostsRequest({
          page: 1,
          limit: 12,
          category: activeCategory || undefined,
        });

        setPosts(response.posts);
        setMeta(response.meta);
        setPage(1);
      } catch (error) {
        toast.error(error.response?.data?.message || "Unable to load feed.");
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
  }, [activeCategory]);

  const loadMore = () => {
    if (!loading && meta.hasMore) {
      getPostsRequest({
        page: page + 1,
        limit: 12,
        category: activeCategory || undefined,
      })
        .then((response) => {
          setPosts((previous) => [...previous, ...response.posts]);
          setMeta(response.meta);
          setPage((previous) => previous + 1);
        })
        .catch((error) => {
          toast.error(error.response?.data?.message || "Unable to load more pins.");
        });
    }
  };

  const observerRef = useInfiniteScroll(loadMore, meta.hasMore);

  const handleAction = async (id, action) => {
    if (!isAuthenticated) {
      toast.error("Please sign in to interact with pins.");
      return;
    }

    try {
      const response = await action(id);
      const updatedPost = response.post;

      if (updatedPost?._id) {
        setPosts((previous) =>
          previous.map((post) => (post._id === updatedPost._id ? { ...post, ...updatedPost } : post))
        );
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Action failed.");
    }
  };

  return (
    <div className="space-y-5 sm:space-y-6">
      <motion.section
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass-panel soft-shadow relative overflow-hidden rounded-[2rem] border border-white/60 p-4 sm:rounded-[2.5rem] sm:p-6"
      >
        <div className="absolute inset-x-0 top-0 h-32 bg-gradient-to-r from-rose-200/40 via-amber-100/10 to-sky-200/40" />
        <div className="relative grid gap-4 xl:grid-cols-[minmax(0,1.35fr)_minmax(280px,0.65fr)] xl:items-end">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full bg-white/85 px-3 py-2 text-[11px] font-semibold uppercase tracking-[0.28em] text-rose-500">
              <Sparkles size={14} />
              Curated right now
            </div>
            <h1 className="mt-4 max-w-4xl text-4xl font-semibold tracking-tight text-slate-950 sm:text-5xl xl:text-6xl">
              Collect visual ideas, discover standout creators, and build boards that feel worth saving.
            </h1>
            <p className="mt-4 max-w-2xl text-sm leading-7 text-slate-500 sm:text-base">
              A polished inspiration network for references, moodboards, and creator-driven posts across design, lifestyle, travel, and culture.
            </p>
            <div className="mt-6 flex flex-wrap gap-2">
              {categories.slice(0, 7).map((category) => (
                <button
                  key={category}
                  type="button"
                  onClick={() => {
                    setLoading(true);
                    setPosts([]);
                    setActiveCategory(category);
                  }}
                  className="rounded-full border border-white/80 bg-white/75 px-4 py-2 text-sm font-medium text-slate-600 transition duration-200 hover:-translate-y-0.5 hover:bg-white hover:text-slate-950"
                >
                  {category}
                </button>
              ))}
            </div>
          </div>
          <div className="grid gap-3 sm:grid-cols-3 xl:grid-cols-1">
            <div className="rounded-[2rem] bg-slate-950 px-5 py-5 text-white shadow-xl shadow-slate-950/15">
              <p className="flex items-center gap-2 text-xs uppercase tracking-[0.22em] text-white/55">
                <TrendingUp size={14} />
                Live feed
              </p>
              <p className="mt-3 text-3xl font-semibold">Fresh picks</p>
              <p className="mt-2 text-sm text-white/70">New posts flowing into a dense, scrollable discovery feed.</p>
            </div>
            <div className="rounded-[2rem] bg-white/85 px-5 py-5">
              <p className="flex items-center gap-2 text-xs uppercase tracking-[0.22em] text-slate-400">
                <Flame size={14} />
                Trending
              </p>
              <p className="mt-3 text-2xl font-semibold text-slate-950">What people save</p>
              <p className="mt-2 text-sm text-slate-500">High-interest ideas, visual references, and standout creative work.</p>
            </div>
            <div className="rounded-[2rem] bg-gradient-to-br from-sky-100 to-white px-5 py-5">
              <p className="flex items-center gap-2 text-xs uppercase tracking-[0.22em] text-sky-600">
                <Wand2 size={14} />
                Studio mode
              </p>
              <p className="mt-3 text-2xl font-semibold text-slate-950">Build your taste</p>
              <p className="mt-2 text-sm text-slate-500">Shape a personal library of boards, saves, and creator inspiration.</p>
            </div>
          </div>
        </div>
        <div className="mt-6">
          <CategoryChips
            activeCategory={activeCategory}
            onSelect={(category) => {
              setLoading(true);
              setPosts([]);
              setActiveCategory(category);
            }}
          />
        </div>
      </motion.section>
      {loading ? (
        <FeedSkeleton />
      ) : (
        <motion.section
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-4"
        >
          <div className="flex flex-col gap-3 rounded-[2rem] border border-white/60 bg-white/65 p-4 shadow-lg shadow-slate-900/5 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-xs uppercase tracking-[0.22em] text-slate-400">Feed overview</p>
              <h2 className="mt-1 text-2xl font-semibold tracking-tight text-slate-950">Today&apos;s visual mix</h2>
            </div>
            <div className="flex flex-wrap gap-2 text-sm">
              <span className="rounded-full bg-slate-950 px-3 py-2 text-white">{posts.length} visible pins</span>
              <span className="rounded-full bg-white px-3 py-2 text-slate-600 shadow-sm">Updated in real time</span>
            </div>
          </div>
          <MasonryFeed
            posts={posts}
            onLike={(id) => handleAction(id, toggleLikeRequest)}
            onSave={(id) => handleAction(id, toggleSaveRequest)}
            isAuthenticated={isAuthenticated}
          />
          {meta.hasMore && <div ref={observerRef} className="h-10" />}
        </motion.section>
      )}
    </div>
  );
}

export default HomePage;
