import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useParams } from "react-router-dom";
import MasonryFeed from "../components/feed/MasonryFeed.jsx";
import PageLoader from "../components/common/PageLoader.jsx";
import ProfileHeader from "../components/profile/ProfileHeader.jsx";
import useAuth from "../hooks/useAuth.js";
import { getUserProfileRequest } from "../services/userService.js";

function ProfilePage() {
  const { id } = useParams();
  const { user: currentUser, isAuthenticated } = useAuth();
  const [profile, setProfile] = useState(null);
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

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

  return (
    <div className="space-y-6">
      <ProfileHeader user={profile} isOwner={String(profile._id) === String(currentUser?._id)} />
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
        emptyTitle="No creator posts yet"
        emptyDescription="This profile is ready for a portfolio-quality gallery once the first post is published."
      />
    </div>
  );
}

export default ProfilePage;
