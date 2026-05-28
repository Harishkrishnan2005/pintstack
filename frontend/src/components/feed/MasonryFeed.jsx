import Masonry from "react-masonry-css";
import EmptyState from "../common/EmptyState.jsx";
import PostCard from "./PostCard.jsx";

const breakpoints = {
  default: 4,
  1280: 3,
  900: 2,
  640: 1,
};

function MasonryFeed({
  posts,
  onLike,
  onSave,
  isAuthenticated,
  emptyTitle,
  emptyDescription,
}) {
  if (!posts.length) {
    return (
      <EmptyState
        title={emptyTitle || "No pins found yet"}
        description={
          emptyDescription ||
          "Try a different search, category, or create the first post for this tenant."
        }
      />
    );
  }

  return (
    <Masonry breakpointCols={breakpoints} className="masonry-grid" columnClassName="masonry-grid_column">
      {posts.map((post) => (
        <div key={post._id}>
          <PostCard
            post={post}
            onLike={onLike}
            onSave={onSave}
            isAuthenticated={isAuthenticated}
          />
        </div>
      ))}
    </Masonry>
  );
}

export default MasonryFeed;
