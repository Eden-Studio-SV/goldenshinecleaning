import { useEffect, useRef, useState } from "react";

/**
 * Hook to trigger animations when an element enters the viewport.
 * @param threshold The percentage of the element that needs to be visible to trigger the animation (0 to 1)
 */
export function useReveal(threshold = 0.1) {
  const ref = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const [entry] = entries;
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.unobserve(element); // Only trigger once
        }
      },
      {
        threshold,
        rootMargin: "0px 0px -50px 0px", // Trigger slightly before it fully comes into view
      }
    );

    observer.observe(element);

    return () => {
      if (element) {
        observer.unobserve(element);
      }
    };
  }, [threshold]);

  const revealClasses = isVisible
    ? "opacity-100 translate-y-0 transition-all duration-700 ease-out"
    : "opacity-0 translate-y-8 transition-all duration-700 ease-out";

  return { ref, isVisible, revealClasses };
}
