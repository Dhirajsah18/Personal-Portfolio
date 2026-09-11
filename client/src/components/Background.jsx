import { useEffect } from "react";

const Background = () => {
  useEffect(() => {
    // Highly-optimized mouse move listener using requestAnimationFrame
    let rafId = null;
    let mouseX = window.innerWidth / 2;
    let mouseY = window.innerHeight / 2;

    // Disable mouse spotlight listener on touch/mobile devices to save battery & CPU
    const isTouch = window.matchMedia("(pointer: coarse)").matches;

    const handleMouseMove = (e) => {
      mouseX = e.clientX;
      mouseY = e.clientY;

      if (!rafId) {
        rafId = requestAnimationFrame(() => {
          document.documentElement.style.setProperty("--mouse-x", `${mouseX}px`);
          document.documentElement.style.setProperty("--mouse-y", `${mouseY}px`);
          rafId = null;
        });
      }
    };

    // Scroll progress bar tracker
    const handleScroll = () => {
      const winScroll = document.documentElement.scrollTop || document.body.scrollTop;
      const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
      const scrolled = height > 0 ? (winScroll / height) * 100 : 0;
      const bar = document.getElementById("scroll-progress");
      if (bar) {
        bar.style.width = `${scrolled}%`;
      }
    };

    if (!isTouch) {
      window.addEventListener("mousemove", handleMouseMove, { passive: true });
    }
    window.addEventListener("scroll", handleScroll, { passive: true });

    return () => {
      if (!isTouch) {
        window.removeEventListener("mousemove", handleMouseMove);
      }
      window.removeEventListener("scroll", handleScroll);
      if (rafId) cancelAnimationFrame(rafId);
    };
  }, []);

  return (
    <>
      <div id="scroll-progress" role="progressbar" aria-label="Reading progress" />
      <div className="mouse-spotlight" aria-hidden="true" />
      <div className="bg-orbs" aria-hidden="true">
        <span className="orb-1" />
        <span className="orb-2" />
        <span className="orb-3" />
      </div>
      <div className="bg-grid" aria-hidden="true" />
    </>
  );
};

export default Background;

