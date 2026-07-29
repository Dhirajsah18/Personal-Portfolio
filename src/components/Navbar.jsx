import { useEffect, useState } from "react";
import { FiSun, FiMoon, FiMenu, FiX } from "react-icons/fi";
import { useTheme } from "../context/ThemeContext";
import { navLinks } from "../data";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { theme, toggleTheme } = useTheme();

  useEffect(() => {
    document.body.classList.toggle("overflow-hidden", isOpen);
    return () => document.body.classList.remove("overflow-hidden");
  }, [isOpen]);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <nav
      className={`glass fixed top-3 left-1/2 -translate-x-1/2 w-[94%] max-w-6xl z-50 transition-all duration-300 ${
        scrolled ? "py-2" : "py-3"
      }`}
      style={{ borderRadius: "18px" }}
    >
      <div className="px-5 flex justify-between items-center">
        <a
          href="#home"
          className="font-display text-lg md:text-xl font-semibold tracking-tight transition-transform hover:scale-105 inline-block"
          style={{ color: "var(--text-primary)" }}
        >
          Dhiraj<span className="text-gradient"></span>
        </a>

        {/* Desktop Menu */}
        <ul className="hidden md:flex gap-8 items-center">
          {navLinks.map((link) => (
            <li key={link.id}>
              <a
                href={`#${link.id}`}
                className="link-underline font-body text-sm font-semibold tracking-wide uppercase opacity-80 hover:opacity-100 transition-opacity"
                style={{ color: "var(--text-primary)" }}
              >
                {link.label}
              </a>
            </li>
          ))}
        </ul>

        <div className="flex items-center gap-3">
          {/* Theme toggle */}
          <button
            onClick={toggleTheme}
            aria-label="Toggle color theme"
            className="glass icon-ring w-10 h-10 grid place-items-center rounded-full hover:scale-110 hover:rotate-12 transition-transform"
            style={{ color: "var(--accent)" }}
          >
            {theme === "dark" ? <FiSun size={18} /> : <FiMoon size={18} />}
          </button>

          {/* Hamburger */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            aria-label="Toggle menu"
            className="md:hidden glass w-10 h-10 grid place-items-center rounded-full"
            style={{ color: "var(--text-primary)" }}
          >
            {isOpen ? <FiX size={18} /> : <FiMenu size={18} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <div
        className={`md:hidden fixed top-0 left-0 w-full h-screen z-40 transform transition-transform duration-500 ease-in-out ${
          isOpen ? "translate-y-0" : "-translate-y-full"
        }`}
        style={{
            background: "var(--mobile-menu-bg)",
          backdropFilter: "blur(24px) saturate(160%)",
          WebkitBackdropFilter: "blur(24px) saturate(160%)",
          borderBottom: "1px solid var(--glass-border)",
        }}
      >
        <ul className="flex flex-col items-center justify-center h-full font-display text-3xl space-y-8">
          {navLinks.map((link) => (
            <li key={link.id}>
              <a
                href={`#${link.id}`}
                onClick={() => setIsOpen(false)}
                className="glass px-6 py-2 rounded-full transition-transform hover:scale-105 inline-block"
                style={{ color: "var(--text-primary)" }}
              >
                {link.label}
              </a>
            </li>
          ))}
        </ul>
      </div>
    </nav>
  );
};

export default Navbar;
