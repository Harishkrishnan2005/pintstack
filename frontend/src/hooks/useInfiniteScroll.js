import { useEffect, useRef } from "react";

const useInfiniteScroll = (callback, enabled = true) => {
  const observerRef = useRef(null);

  useEffect(() => {
    if (!enabled || !observerRef.current) {
      return undefined;
    }

    const node = observerRef.current;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          callback();
        }
      },
      { threshold: 0.25 }
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, [callback, enabled]);

  return observerRef;
};

export default useInfiniteScroll;
