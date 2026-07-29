import { useEffect, useRef } from "react";

/**
 * Attaches an IntersectionObserver to a ref and toggles the
 * `in-view` class on children marked with `.reveal` when they
 * scroll into the viewport.
 */
export const useReveal = () => {
  const containerRef = useRef(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const targets = container.classList.contains("reveal")
      ? [container]
      : Array.from(container.querySelectorAll(".reveal"));

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("in-view");
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.15 }
    );

    targets.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  return containerRef;
};
