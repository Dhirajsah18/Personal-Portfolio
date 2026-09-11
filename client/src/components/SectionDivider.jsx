import { HiSparkles } from "react-icons/hi2";

const SectionDivider = () => {
  return (
    <div
      className="relative max-w-5xl mx-auto px-6 py-6 flex items-center justify-center pointer-events-none select-none"
      aria-hidden="true"
    >
      {/* Left Beam with Micro Node */}
      <div className="flex-1 flex items-center">
        <div className="w-full h-px bg-gradient-to-r from-transparent via-[var(--glass-border)] to-[var(--glass-border)] opacity-80" />
        <span className="w-1.5 h-1.5 rounded-full bg-[var(--accent)] opacity-60 shrink-0 ml-1.5" />
      </div>

      {/* Center Frosted Minimal Emblem */}
      <div className="mx-4 flex items-center gap-1.5 px-3 py-1 rounded-full glass border border-[var(--glass-border)]">
        <span className="w-1 h-1 rounded-full bg-[var(--accent)]" />
        <HiSparkles className="text-xs" style={{ color: "var(--accent)" }} />
        <span className="w-1 h-1 rounded-full bg-[var(--accent)]" />
      </div>

      {/* Right Beam with Micro Node */}
      <div className="flex-1 flex items-center">
        <span className="w-1.5 h-1.5 rounded-full bg-[var(--accent)] opacity-60 shrink-0 mr-1.5" />
        <div className="w-full h-px bg-gradient-to-l from-transparent via-[var(--glass-border)] to-[var(--glass-border)] opacity-80" />
      </div>
    </div>
  );
};

export default SectionDivider;
