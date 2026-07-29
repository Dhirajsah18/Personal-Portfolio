import { FaLinkedin, FaGithub, FaEnvelope } from "react-icons/fa";
import { FiArrowDownRight, FiBookOpen } from "react-icons/fi";
import profileImg from "../assets/profile.jpg";
import { profile } from "../data";
import { useReveal } from "../hooks/useReveal";

const Hero = () => {
  const ref = useReveal();

  return (
    <section
      id="home"
      ref={ref}
      className="section-tint tint-violet min-h-screen flex items-center pt-28 pb-16 px-4"
    >
      <div className="max-w-6xl mx-auto w-full glass p-8 md:p-14 grid md:grid-cols-[1.2fr_0.8fr] gap-12 items-center">
        {/* LEFT */}
        <div className="reveal">
          <p
            className="font-mono text-xs tracking-[0.3em] uppercase mb-4"
            style={{ color: "var(--accent)" }}
          >
            Portfolio
          </p>

          <div className="relative h-9 md:h-10 overflow-hidden font-mono text-sm md:text-base font-medium mb-3">
            <div className="absolute inset-0">
              {profile.roles.map((role) => (
                <div key={role} className="fade-zoom-word" style={{ color: "var(--accent)" }}>
                  {role}
                </div>
              ))}
            </div>
          </div>

          <h1
            className="font-display text-5xl md:text-6xl leading-[1.05] font-semibold mb-6"
            style={{ color: "var(--text-primary)" }}
          >
            Hi, I'm{" "}
            <span className="heading-accent text-gradient">
              {profile.name}
            </span>
          </h1>

          <p
            className="text-base md:text-lg max-w-xl mb-8 leading-relaxed"
            style={{ color: "var(--text-secondary)" }}
          >
            {profile.bio}
          </p>

          <div className="flex flex-wrap items-center gap-4">
            <a
              href={profile.resumeUrl}
              download
              className="btn-shine group inline-flex items-center gap-2 px-6 py-3 rounded-full font-semibold text-sm transition-transform hover:scale-105"
              style={{ background: "var(--accent)", color: "var(--bg-base)" }}
            >
              Download CV
              <FiArrowDownRight className="group-hover:translate-x-0.5 group-hover:translate-y-0.5 transition-transform" />
            </a>

            <div className="flex items-center gap-3">
              {[
                { href: profile.socials.linkedin, icon: <FaLinkedin />, label: "LinkedIn" },
                { href: profile.socials.github, icon: <FaGithub />, label: "GitHub" },
                { href: profile.socials.email, icon: <FaEnvelope />, label: "Email" },
              ].map((s) => (
                <a
                  key={s.label}
                  href={s.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  title={s.label}
                  className="glass icon-ring w-11 h-11 grid place-items-center rounded-full text-lg hover:scale-110 hover:-translate-y-1 transition-transform"
                  style={{ color: "var(--text-primary)" }}
                >
                  {s.icon}
                </a>
              ))}
            </div>
          </div>
        </div>

        {/* RIGHT */}
        <div className="reveal flex justify-center md:justify-end relative" style={{ transitionDelay: "150ms" }}>
          <div className="relative animate-floaty">
            <div
              className="glow-pulse absolute -inset-4 rounded-full blur-2xl"
              style={{ background: "linear-gradient(135deg, var(--accent), var(--accent-2))" }}
            />
            <img
              src={profileImg}
              alt={profile.name}
              className="relative w-64 h-64 md:w-80 md:h-80 object-cover rounded-full border-4"
              style={{ borderColor: "var(--glass-border)" }}
            />

            {/* Floating mock code editor card */}
            <div
              className="glass animate-floaty-slow hidden sm:block absolute -top-6 -right-6 md:-right-14 w-48 md:w-56 p-3.5 font-mono text-[10.5px] leading-relaxed select-none"
              style={{ animationDelay: "1.2s" }}
            >
              <div className="flex gap-1.5 mb-2.5">
                <span className="w-2 h-2 rounded-full bg-red-400/80" />
                <span className="w-2 h-2 rounded-full bg-yellow-400/80" />
                <span className="w-2 h-2 rounded-full bg-green-400/80" />
              </div>
              <p style={{ color: "var(--text-secondary)" }}>
                <span style={{ color: "var(--accent-2)" }}>const</span> dev = {"{"}
              </p>
              <p className="pl-3" style={{ color: "var(--text-secondary)" }}>
                stack: <span style={{ color: "var(--accent)" }}>'MERN'</span>,
              </p>
              <p className="pl-3" style={{ color: "var(--text-secondary)" }}>
                craft: <span style={{ color: "var(--accent)" }}>'clean code'</span>,
              </p>
              <p className="pl-3" style={{ color: "var(--text-secondary)" }}>
                mindset: <span style={{ color: "var(--accent)" }}>'ship fast'</span>
              </p>
              <p style={{ color: "var(--text-secondary)" }}>
                {"}"}
                <span className="blink-cursor" style={{ color: "var(--accent)" }}>▍</span>
              </p>
            </div>

            {/* Floating stat badges */}
            <div
              className="glass animate-floaty hidden sm:flex absolute -bottom-4 -left-6 md:-left-10 items-center gap-2 px-4 py-2.5"
              style={{ animationDelay: "0.6s" }}
            >
              <span className="relative flex w-2.5 h-2.5 shrink-0">
                <span
                  className="glow-pulse absolute inline-flex w-full h-full rounded-full"
                  style={{ background: "#4ade80" }}
                />
                <span className="relative inline-flex w-2.5 h-2.5 rounded-full" style={{ background: "#4ade80" }} />
              </span>
              <span className="text-xs font-semibold" style={{ color: "var(--text-primary)" }}>
                Open to Work
              </span>
            </div>

            <div
              className="glass animate-floaty-slow hidden md:flex absolute bottom-10 -right-10 items-center gap-2 px-4 py-2.5"
              style={{ animationDelay: "2s" }}
            >
              <FiBookOpen size={16} style={{ color: "var(--accent-2)" }} />
              <span className="text-[11px] leading-tight" style={{ color: "var(--text-secondary)" }}>
                Always<br />Learning
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
