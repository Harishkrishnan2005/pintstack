import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import MasonryFeed from "../components/feed/MasonryFeed.jsx";
import PageLoader from "../components/common/PageLoader.jsx";
import useAuth from "../hooks/useAuth.js";
import { getSavedPostsRequest } from "../services/userService.js";

function SavedPostsPage() {
  const { isAuthenticated } = useAuth();
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSaved = async () => {
      try {
        const response = await getSavedPostsRequest();
        setPosts(response.posts);
      } catch (error) {
        toast.error(error.response?.data?.message || "Unable to load saved posts.");
      } finally {
        setLoading(false);
      }
    };

    fetchSaved();
  }, []);

  if (loading) {
    return <PageLoader label="Loading saved pins..." />;
  }

  return (
    <div className="space-y-5">
      <div className="glass-panel rounded-[2.25rem] border border-white/60 p-5 soft-shadow">
        <p className="text-xs uppercase tracking-[0.26em] text-sky-500">Library</p>
        <h1 className="mt-2 text-4xl font-semibold tracking-tight text-slate-950">Saved posts</h1>
        <p className="mt-3 max-w-2xl text-sm leading-7 text-slate-500">
          Your personal vault of inspiration, references, and creator-quality posts worth revisiting.
        </p>
      </div>
      <MasonryFeed
        posts={posts}
        onLike={() => {}}
        onSave={() => {}}
        isAuthenticated={isAuthenticated}
        emptyTitle="No saved posts yet"
        emptyDescription="Start bookmarking the pins that match your taste and they’ll show up here in a beautiful personal library."
      />
    </div>
  );
}

export default SavedPostsPage;
