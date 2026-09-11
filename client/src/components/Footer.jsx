import { FiGithub, FiLinkedin, FiMail } from "react-icons/fi";
import { profile, navLinks } from "../data";

const Footer = () => {
  const socials = [
    { href: profile.socials.github, icon: <FiGithub size={16} />, label: "GitHub" },
    { href: profile.socials.linkedin, icon: <FiLinkedin size={16} />, label: "LinkedIn" },
    { href: profile.socials.email, icon: <FiMail size={16} />, label: "Email" },
  ];

  return (
    <footer className="px-4 pb-12 pt-8">
      <div className="max-w-6xl mx-auto glass p-8 sm:p-12 rounded-3xl">
        <div className="grid md:grid-cols-[1.5fr_1fr_1fr] gap-10 mb-10">
          {/* Brand */}
          <div className="space-y-3 max-w-sm">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-xl bg-[var(--accent)] flex items-center justify-center text-white font-display font-bold text-sm shadow-sm">
                D
              </div>
              <p className="font-display text-2xl font-black tracking-tight" style={{ color: "var(--text-primary)" }}>
                {profile.shortName}
                <span style={{ color: "var(--accent)" }}>.dev</span>
              </p>
            </div>
            <p className="text-sm leading-relaxed" style={{ color: "var(--text-secondary)" }}>
              {profile.tagline}
            </p>
          </div>

          {/* Quick links */}
          <div>
            <p className="font-mono text-xs font-bold tracking-[0.2em] uppercase mb-4 text-[var(--accent)]">
              Navigation
            </p>
            <ul className="grid grid-cols-2 gap-x-4 gap-y-2.5">
              {navLinks.map((link) => (
                <li key={link.id}>
                  <a
                    href={`#${link.id}`}
                    className="link-underline text-xs sm:text-sm font-semibold hover:text-[var(--accent)] transition-colors"
                    style={{ color: "var(--text-secondary)" }}
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Socials & Connect */}
          <div>
            <p className="font-mono text-xs font-bold tracking-[0.2em] uppercase mb-4 text-[var(--accent)]">
              Connect
            </p>
            <div className="flex items-center gap-2.5">
              {socials.map((s) => (
                <a
                  key={s.label}
                  href={s.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  title={s.label}
                  aria-label={s.label}
                  className="glass icon-ring w-10 h-10 grid place-items-center rounded-2xl text-base hover:scale-110 hover:-translate-y-1 transition-transform"
                  style={{ color: "var(--text-primary)" }}
                >
                  {s.icon}
                </a>
              ))}
            </div>
            <div className="text-xs text-[var(--text-muted)] mt-4 space-y-0.5 leading-relaxed">
              <p>Kolkata, India</p>
              <p className="text-[var(--text-secondary)]">Open for remote & relocation</p>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div
          className="pt-6 border-t text-center sm:text-left"
          style={{ borderColor: "var(--glass-border)" }}
        >
          <p className="text-xs" style={{ color: "var(--text-muted)" }}>
            © {new Date().getFullYear()} {profile.name}. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

