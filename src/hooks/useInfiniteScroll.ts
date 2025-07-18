import { useEffect, useRef, useState } from "react";

export const useInfiniteScroll = (
  displayedSections: any[],
  groupedItems: any[],
  setDisplayedSections: React.Dispatch<React.SetStateAction<any[]>>
) => {
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const observerRef = useRef<IntersectionObserver | null>(null);
  const loadingDivRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (
          entries[0].isIntersecting &&
          !isLoadingMore &&
          displayedSections.length < groupedItems.length
        ) {
          setIsLoadingMore(true);
          setTimeout(() => {
            setDisplayedSections((prev) => [
              ...prev,
              ...groupedItems.slice(prev.length, prev.length + 1),
            ]);
            setIsLoadingMore(false);
          }, 500);
        }
      },
      { root: null, rootMargin: "20px", threshold: 0.1 }
    );

    observerRef.current = observer;
    return () => observer.disconnect();
  }, [displayedSections, isLoadingMore, groupedItems, setDisplayedSections]);

  useEffect(() => {
    if (loadingDivRef.current && observerRef.current) {
      observerRef.current.observe(loadingDivRef.current);
    }
  }, [displayedSections]);

  return { isLoadingMore, loadingDivRef };
};
