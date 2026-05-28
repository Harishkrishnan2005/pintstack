import { motion } from "framer-motion";
import { MapPin, Sparkles, Star } from "lucide-react";
import { Link } from "react-router-dom";
import { formatCompactNumber } from "../../utils/formatters.js";
import Button from "../ui/Button.jsx";

function ProfileHeader({ user, isOwner = false }) {
  return (
    <section className="glass-panel soft-shadow overflow-hidden rounded-[2.4rem] border border-white/60">
      <div className="h-36 bg-[radial-gradient(circle_at_top_left,_rgba(244,63,94,0.48),_transparent_32%),linear-gradient(135deg,_#0f172a_0%,_#1e293b_38%,_#fb7185_140%)] sm:h-44" />
      <div className="px-5 pb-5 sm:px-6 sm:pb-6">
        <div className="-mt-14 flex flex-col gap-5 sm:-mt-16 sm:flex-row sm:items-center">
          <motion.img
            initial={{ scale: 0.92, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            src={user.profileImage}
            alt={user.username}
            className="h-24 w-24 rounded-[2rem] object-cover ring-4 ring-white sm:h-28 sm:w-28"
          />
          <div className="flex-1">
            <div className="flex flex-wrap items-center gap-2">
              <p className="text-xs uppercase tracking-[0.24em] text-rose-500">Creator profile</p>
              <span className="inline-flex items-center gap-1 rounded-full bg-white px-3 py-1 text-xs font-medium text-slate-500 shadow-sm">
                <Sparkles size={12} />
                Curated
              </span>
            </div>
            <h1 className="mt-2 text-3xl font-semibold tracking-tight text-slate-950">{user.username}</h1>
            <p className="mt-3 max-w-2xl text-sm leading-7 text-slate-500">{user.bio}</p>
          </div>
          {isOwner && (
            <Link to="/profile/edit">
              <Button className="bg-gradient-to-r from-slate-950 to-slate-700">Edit profile</Button>
            </Link>
          )}
        </div>
        <div className="mt-5 flex flex-wrap gap-3 text-sm">
          <span className="inline-flex items-center gap-2 rounded-full bg-white px-4 py-2 text-slate-600 shadow-sm">
            <Star size={14} />
            {formatCompactNumber(user.followers?.length || user.followersCount)} followers
          </span>
          <span className="inline-flex items-center gap-2 rounded-full bg-white px-4 py-2 text-slate-600 shadow-sm">
            {formatCompactNumber(user.following?.length || user.followingCount)} following
          </span>
          <span className="inline-flex items-center gap-2 rounded-full bg-white px-4 py-2 text-slate-600 shadow-sm">
            <MapPin size={14} />
            Tenant: {user.tenantId}
          </span>
        </div>
      </div>
    </section>
  );
}

export default ProfileHeader;
