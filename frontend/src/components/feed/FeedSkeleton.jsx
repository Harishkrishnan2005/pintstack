function FeedSkeleton() {
  return (
    <div className="masonry-grid">
      {[...Array(6)].map((_, index) => (
        <div key={index} className="masonry-grid_column">
          <div className="h-72 animate-pulse rounded-[2rem] bg-white/70" />
        </div>
      ))}
    </div>
  );
}

export default FeedSkeleton;
