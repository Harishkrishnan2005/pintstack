import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useParams } from "react-router-dom";
import MasonryFeed from "../components/feed/MasonryFeed.jsx";
import PageLoader from "../components/common/PageLoader.jsx";
import ProfileHeader from "../components/profile/ProfileHeader.jsx";
import useAuth from "../hooks/useAuth.js";
import { deletePostRequest } from "../services/postService.js";
import { getUserProfileRequest, toggleFollowRequest } from "../services/userService.js";

function ProfilePage() {
  const { id } = useParams();
  const { user: currentUser, isAuthenticated, setUser } = useAuth();
  const [profile, setProfile] = useState(null);
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [followLoading, setFollowLoading] = useState(false);

  useEffect(() => {
    const profileId = id === "me" ? currentUser?._id : id;
    if (!profileId) {
      return;
    }

    setLoading(true);
    const fetchProfile = async () => {
      try {
        const response = await getUserProfileRequest(profileId);
        setProfile(response.user);
        setPosts(response.posts);
      } catch (error) {
        toast.error(error.response?.data?.message || "Unable to load profile.");
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [id, currentUser?._id]);

  if (id === "me" && !currentUser?._id) {
    return <PageLoader label="Preparing profile..." />;
  }

  if (loading) {
    return <PageLoader label="Loading profile..." />;
  }

  if (!profile) {
    return null;
  }

  const isOwner = String(profile._id) === String(currentUser?._id);
  const isFollowing = profile.followers?.some(
    (userId) => String(userId) === String(currentUser?._id)
  );

  const handleFollowToggle = async () => {
    if (!isAuthenticated || isOwner || followLoading) {
      return;
    }

    setFollowLoading(true);
    try {
      const response = await toggleFollowRequest(profile._id);
      setProfile(response.user);
      setUser((previous) => (previous ? { ...previous, ...response.currentUser } : previous));
      toast.success(response.message);
    } catch (error) {
      toast.error(error.response?.data?.message || "Unable to update follow status.");
    } finally {
      setFollowLoading(false);
    }
  };

  const handleDeletePost = async (post) => {
    if (!window.confirm(`Delete "${post.title}"?`)) {
      return;
    }

    try {
      const response = await deletePostRequest(post._id);
      setPosts((previous) => previous.filter((item) => item._id !== post._id));
      toast.success(response.message);
    } catch (error) {
      toast.error(error.response?.data?.message || "Unable to delete post.");
    }
  };

  return (
    <div className="space-y-6">
      <ProfileHeader
        user={profile}
        isOwner={isOwner}
        isAuthenticated={isAuthenticated}
        isFollowing={Boolean(isFollowing)}
        onFollowToggle={handleFollowToggle}
        followLoading={followLoading}
      />
      <div className="grid gap-3 sm:grid-cols-3">
        <div className="rounded-[1.8rem] border border-white/60 bg-white/75 p-4 shadow-sm">
          <p className="text-xs uppercase tracking-[0.22em] text-slate-400">Boards</p>
          <p className="mt-2 text-2xl font-semibold text-slate-950">{posts.length}</p>
        </div>
        <div className="rounded-[1.8rem] border border-white/60 bg-white/75 p-4 shadow-sm">
          <p className="text-xs uppercase tracking-[0.22em] text-slate-400">Followers</p>
          <p className="mt-2 text-2xl font-semibold text-slate-950">
            {profile.followers?.length || profile.followersCount || 0}
          </p>
        </div>
        <div className="rounded-[1.8rem] border border-white/60 bg-white/75 p-4 shadow-sm">
          <p className="text-xs uppercase tracking-[0.22em] text-slate-400">Following</p>
          <p className="mt-2 text-2xl font-semibold text-slate-950">
            {profile.following?.length || profile.followingCount || 0}
          </p>
        </div>
      </div>
      <MasonryFeed
        posts={posts}
        onLike={() => {}}
        onSave={() => {}}
        isAuthenticated={isAuthenticated}
        showDeleteAction={isOwner}
        onDelete={handleDeletePost}
        emptyTitle="No creator posts yet"
        emptyDescription="This profile is ready for a portfolio-quality gallery once the first post is published."
      />
    </div>
  );
}

export default ProfilePage;
