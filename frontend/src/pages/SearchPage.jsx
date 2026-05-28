import { startTransition, useDeferredValue, useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Compass, Search, Sparkles, TrendingUp } from "lucide-react";
import toast from "react-hot-toast";
import MasonryFeed from "../components/feed/MasonryFeed.jsx";
import ProfileHeader from "../components/profile/ProfileHeader.jsx";
import useAuth from "../hooks/useAuth.js";
import useDebounce from "../hooks/useDebounce.js";
import { categories } from "../constants/categories.js";
import { getPostsRequest, toggleLikeRequest, toggleSaveRequest } from "../services/postService.js";
import { searchPostsRequest, searchUsersRequest } from "../services/searchService.js";

function SearchPage() {
  const { isAuthenticated } = useAuth();
  const [query, setQuery] = useState("");
  const [posts, setPosts] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const debouncedQuery = useDebounce(query);
  const deferredQuery = useDeferredValue(query);

  useEffect(() => {
    const runSearch = async () => {
      try {
        setLoading(true);

        if (!debouncedQuery.trim()) {
          const response = await getPostsRequest({ page: 1, limit: 18 });
          setPosts(response.posts);
          setUsers([]);
          return;
        }

        const [postResponse, userResponse] = await Promise.all([
          searchPostsRequest(debouncedQuery),
          searchUsersRequest(debouncedQuery),
        ]);
        setPosts(postResponse.posts);
        setUsers(userResponse.users);
      } catch (error) {
        toast.error(error.response?.data?.message || "Search failed.");
      } finally {
        setLoading(false);
      }
    };

    runSearch();
  }, [debouncedQuery]);

  const handleAction = async (id, action) => {
    if (!isAuthenticated) {
      toast.error("Please sign in to interact with pins.");
      return;
    }

    try {
      const response = await action(id);
      if (response.post?._id) {
        setPosts((previous) =>
          previous.map((post) => (post._id === response.post._id ? { ...post, ...response.post } : post))
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
        className="glass-panel relative overflow-hidden rounded-[2rem] border border-white/60 p-4 soft-shadow sm:rounded-[2.5rem] sm:p-6"
      >
        <div className="absolute inset-x-0 top-0 h-24 bg-gradient-to-r from-rose-200/40 via-white/0 to-sky-200/40" />
        <div className="relative grid gap-5 xl:grid-cols-[minmax(0,1fr)_320px] xl:items-end">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full bg-white/80 px-3 py-2 text-[11px] font-semibold uppercase tracking-[0.26em] text-sky-600">
              <Compass size={14} />
              Explore
            </div>
            <h1 className="mt-4 max-w-2xl text-3xl font-semibold tracking-tight text-slate-950 sm:text-4xl">
              Discover the latest pins first, then narrow by ideas, creators, and categories.
            </h1>
            <p className="mt-3 max-w-2xl text-sm leading-7 text-slate-500">
              The explore view now opens with the newest posts so the page feels alive even before searching.
            </p>
            <div className="mt-5 flex flex-wrap gap-2">
              {categories.slice(0, 5).map((category) => (
                <button
                  key={category}
                  type="button"
                  onClick={() => {
                    startTransition(() => setQuery(category));
                  }}
                  className="rounded-full border border-white/80 bg-white/75 px-4 py-2 text-sm font-medium text-slate-600 transition hover:-translate-y-0.5 hover:bg-white"
                >
                  {category}
                </button>
              ))}
            </div>
          </div>
          <div className="rounded-[2rem] bg-slate-950 p-5 text-white">
            <p className="flex items-center gap-2 text-xs uppercase tracking-[0.22em] text-white/60">
              <Sparkles size={14} />
              Browse mode
            </p>
            <p className="mt-4 text-3xl font-semibold">
              {debouncedQuery.trim() ? "Keyword search" : "Latest drops"}
            </p>
            <p className="mt-2 text-sm leading-6 text-white/70">
              {debouncedQuery.trim()
                ? `Showing results for "${deferredQuery}".`
                : "Fresh posts from your feed are shown here by default."}
            </p>
          </div>
        </div>
        <div className="relative mt-6 rounded-[1.9rem] border border-white/80 bg-white/85 p-3 shadow-lg shadow-slate-900/5">
          <div className="flex items-center gap-3 rounded-[1.4rem] bg-slate-50/70 px-4 py-4">
            <Search size={18} className="shrink-0 text-slate-400" />
            <input
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Search travel, branding, creators..."
              className="w-full border-0 bg-transparent text-base text-slate-900 outline-none placeholder:text-slate-400"
            />
          </div>
        </div>
      </motion.section>

      {!!users.length && (
        <section className="space-y-4">
          <div className="flex items-center gap-2">
            <TrendingUp size={18} className="text-rose-500" />
            <h2 className="text-xl font-semibold text-slate-950">People</h2>
          </div>
          <div className="grid gap-4 lg:grid-cols-2">
            {users.map((user) => (
              <ProfileHeader key={user._id} user={user} />
            ))}
          </div>
        </section>
      )}
      <section className="space-y-4">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h2 className="text-2xl font-semibold text-slate-950">
              {debouncedQuery.trim() ? "Search results" : "Latest pins"}
            </h2>
            <p className="text-sm text-slate-500">
              {debouncedQuery.trim()
                ? "Results are filtered only by the keyword you enter."
                : "Fresh posts appear here automatically when Explore first opens."}
            </p>
          </div>
          <div className="text-sm font-medium text-slate-500">
            {loading ? "Refreshing..." : `${posts.length} pins`}
          </div>
        </div>
        <MasonryFeed
          posts={posts}
          onLike={(id) => handleAction(id, toggleLikeRequest)}
          onSave={(id) => handleAction(id, toggleSaveRequest)}
          isAuthenticated={isAuthenticated}
          emptyTitle={debouncedQuery.trim() ? "No matching pins yet" : "No latest pins yet"}
          emptyDescription={
            debouncedQuery.trim()
              ? "Try a broader keyword or switch to one of the quick category prompts."
              : "Create the first post and this explore feed will start feeling alive."
          }
        />
      </section>
    </div>
  );
}

export default SearchPage;
