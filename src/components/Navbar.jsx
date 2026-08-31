import { useEffect, useState } from "react";
import { FiSun, FiMoon, FiMenu, FiX, FiFileText, FiDownload, FiArrowRight } from "react-icons/fi";
import { FaGithub, FaLinkedin, FaEnvelope } from "react-icons/fa";
import { useTheme } from "../context/ThemeContext";
import { navLinks, profile } from "../data";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [activeSection, setActiveSection] = useState("about");
  const { theme, toggleTheme } = useTheme();


  useEffect(() => {
    const onScroll = () => {
      setScrolled(window.scrollY > 25);

      // Section spy to highlight active nav link
      const sections = navLinks.map((link) => document.getElementById(link.id));
      const scrollPos = window.scrollY + 200;

      for (let i = sections.length - 1; i >= 0; i--) {
        const section = sections[i];
        if (section && section.offsetTop <= scrollPos) {
          setActiveSection(navLinks[i].id);
          break;
        }
      }
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className="fixed top-0 left-0 right-0 z-50 flex justify-center px-4 pt-3.5 pointer-events-none"
    >
      <nav
        className={`glass pointer-events-auto w-full max-w-6xl transition-all duration-300 ${
          scrolled ? "py-2.5 px-5 shadow-2xl" : "py-3.5 px-6"
        }`}
        style={{ borderRadius: "20px" }}
      >
        <div className="flex justify-between items-center">
          {/* Brand Logo */}
          <a
            href="#about"
            className="flex items-center gap-2 group transition-transform hover:scale-105"
          >
            <div className="w-8 h-8 rounded-xl bg-[var(--accent)] flex items-center justify-center text-white font-display font-bold text-sm shadow-sm">
              D
            </div>
            <span
              className="font-display text-lg md:text-xl font-bold tracking-tight"
              style={{ color: "var(--text-primary)" }}
            >
              {profile.shortName}
              <span style={{ color: "var(--accent)" }}>.dev</span>
            </span>
          </a>

          {/* Desktop Menu */}
          <ul className="hidden md:flex gap-7 items-center">
            {navLinks.map((link) => {
              const isActive = activeSection === link.id;
              return (
                <li key={link.id}>
                  <a
                    href={`#${link.id}`}
                    className={`text-sm font-semibold link-underline transition-colors ${
                      isActive ? "active" : ""
                    }`}
                    style={{
                      color: isActive
                        ? "var(--accent)"
                        : "var(--text-secondary)",
                    }}
                  >
                    {link.label}
                  </a>
                </li>
              );
            })}
          </ul>

          {/* Actions on Desktop & Mobile Toggle */}
          <div className="flex items-center gap-3">
            {/* Quick CV Button */}
            <a
              href={profile.resumeUrl}
              download
              className="hidden sm:inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-bold border transition-all hover:scale-105"
              style={{
                borderColor: "var(--glass-border)",
                color: "var(--text-primary)",
                background: "var(--glass-bg)",
              }}
            >
              <FiFileText size={13} />
              <span>Resume</span>
            </a>

            {/* Theme toggle */}
            <button
              onClick={toggleTheme}
              aria-label="Toggle color theme"
              className="glass icon-ring w-9 h-9 grid place-items-center rounded-full hover:scale-110 hover:rotate-45 transition-transform"
              style={{ color: "var(--accent)" }}
            >
              {theme === "dark" ? <FiSun size={17} /> : <FiMoon size={17} />}
            </button>

            {/* Mobile Hamburger */}
            <button
              onClick={() => setIsOpen(!isOpen)}
              aria-label="Toggle menu"
              className="md:hidden glass w-9 h-9 grid place-items-center rounded-full"
              style={{ color: "var(--text-primary)" }}
            >
              {isOpen ? <FiX size={18} /> : <FiMenu size={18} />}
            </button>
          </div>
        </div>

        {/* Mobile Dropdown Panel */}
        {isOpen && (
          <div
            className="md:hidden mt-3.5 pt-3.5 border-t space-y-3 animate-fade-in"
            style={{ borderColor: "var(--glass-border)" }}
          >
            {/* Nav Links */}
            <div className="space-y-1">
              {navLinks.map((link) => {
                const isActive = activeSection === link.id;
                return (
                  <a
                    key={link.id}
                    href={`#${link.id}`}
                    onClick={() => setIsOpen(false)}
                    className={`block px-3.5 py-2.5 rounded-xl text-sm font-semibold transition-all duration-150 ${
                      isActive
                        ? "bg-[var(--accent)] text-white font-bold shadow-sm"
                        : "text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--glass-bg)]"
                    }`}
                  >
                    {link.label}
                  </a>
                );
              })}
            </div>

            {/* Bottom Actions & Socials */}
            <div
              className="pt-3 border-t space-y-3"
              style={{ borderColor: "var(--glass-border)" }}
            >
              <a
                href={profile.resumeUrl}
                download
                onClick={() => setIsOpen(false)}
                className="btn-primary w-full py-2.5 rounded-xl text-center text-xs font-bold flex items-center justify-center gap-2"
              >
                <FiDownload size={14} /> Download Resume
              </a>

              <div className="flex items-center justify-center gap-3 pt-0.5">
                {[
                  { href: profile.socials.github, icon: <FaGithub size={15} />, label: "GitHub" },
                  { href: profile.socials.linkedin, icon: <FaLinkedin size={15} />, label: "LinkedIn" },
                  { href: profile.socials.email, icon: <FaEnvelope size={15} />, label: "Email" },
                ].map((s) => (
                  <a
                    key={s.label}
                    href={s.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="glass w-9 h-9 grid place-items-center rounded-xl transition-transform hover:scale-110"
                    style={{ color: "var(--text-primary)" }}
                  >
                    {s.icon}
                  </a>
                ))}
              </div>
            </div>
          </div>
        )}
      </nav>
    </header>
  );
};

export default Navbar;
