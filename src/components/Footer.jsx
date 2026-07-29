import { FiGithub, FiLinkedin, FiMail, FiArrowUp } from "react-icons/fi";
import { profile, navLinks } from "../data";

const Footer = () => {
  const scrollToTop = () =>
    window.scrollTo({ top: 0, behavior: "smooth" });

  const socials = [
    { href: profile.socials.github, icon: <FiGithub />, label: "GitHub" },
    { href: profile.socials.linkedin, icon: <FiLinkedin />, label: "LinkedIn" },
    { href: profile.socials.email, icon: <FiMail />, label: "Email" },
  ];

  return (
    <footer className="px-4 pb-8 pt-4">
      <div className="max-w-6xl mx-auto glass p-8 md:p-10">
        <div className="flex flex-col md:flex-row justify-between gap-10 mb-8">
          {/* Brand */}
          <div className="max-w-sm">
            <p className="font-display text-2xl font-semibold mb-2" style={{ color: "var(--text-primary)" }}>
              {profile.name.split(" ")[0]}
              <span className="text-gradient">.</span>
            </p>
            <p className="text-sm leading-relaxed" style={{ color: "var(--text-secondary)" }}>
              Full-stack web developer building fast, secure, and scalable MERN products — from database to pixel.
            </p>
          </div>

          {/* Quick links */}
          <div>
            <p className="font-mono text-xs tracking-[0.2em] uppercase mb-3" style={{ color: "var(--accent)" }}>
              Quick Links
            </p>
            <ul className="grid grid-cols-2 gap-x-8 gap-y-2">
              {navLinks.map((link) => (
                <li key={link.id}>
                  <a
                    href={`#${link.id}`}
                    className="link-underline text-sm font-medium"
                    style={{ color: "var(--text-secondary)" }}
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Socials */}
          <div>
            <p className="font-mono text-xs tracking-[0.2em] uppercase mb-3" style={{ color: "var(--accent)" }}>
              Connect
            </p>
            <div className="flex items-center gap-3">
              {socials.map((s) => (
                <a
                  key={s.label}
                  href={s.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  title={s.label}
                  className="glass icon-ring w-10 h-10 grid place-items-center rounded-full text-base hover:scale-110 hover:-translate-y-1 transition-transform"
                  style={{ color: "var(--text-primary)" }}
                >
                  {s.icon}
                </a>
              ))}
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div
          className="flex flex-col md:flex-row justify-between items-center gap-3 pt-6 border-t"
          style={{ borderColor: "var(--glass-border)" }}
        >
          <p className="text-sm " style={{ color: "var(--text-secondary)" }}>
            © {new Date().getFullYear()} {profile.name}. All rights reserved.
          </p>
          <div className="flex items-center gap-4">
            <button
              onClick={scrollToTop}
              aria-label="Back to top"
              className="glass icon-ring w-9 h-9 grid place-items-center rounded-full hover:scale-110 hover:-translate-y-1 transition-transform"
              style={{ color: "var(--accent)" }}
            >
              <FiArrowUp size={16} />
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
