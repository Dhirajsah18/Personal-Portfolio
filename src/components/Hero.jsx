import { useState, useEffect } from "react";
import { FaLinkedin, FaGithub, FaEnvelope, FaReact, FaNodeJs } from "react-icons/fa";
import { SiMongodb } from "react-icons/si";
import { FiArrowDownRight, FiDownload, FiZap, FiCheckCircle } from "react-icons/fi";
import profileImg from "../assets/profile.jpg";
import { profile } from "../data";
import { useReveal } from "../hooks/useReveal";

const Hero = () => {
  const ref = useReveal();
  const [roleIndex, setRoleIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setRoleIndex((prev) => (prev + 1) % profile.roles.length);
    }, 2400);
    return () => clearInterval(interval);
  }, []);

  return (
    <section
      id="about"
      ref={ref}
      className="section-tint min-h-screen flex items-center pt-32 pb-20 px-4"
    >
      <div className="max-w-6xl mx-auto w-full glass p-7 md:p-14 grid lg:grid-cols-[1.2fr_0.8fr] gap-12 items-center">
        {/* LEFT COLUMN */}
        <div className="reveal space-y-6">
          {/* Status Badge */}
          <div className="inline-flex items-center gap-2.5 px-4 py-1.5 rounded-full border text-xs font-semibold"
            style={{
              borderColor: "var(--glass-border)",
              background: "var(--glass-bg)",
            }}
          >
            <span className="relative flex h-2.5 w-2.5">
              <span className="radar-beacon absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500" />
            </span>
            <span style={{ color: "var(--text-primary)" }}>Available for Opportunities & Internships</span>
          </div>

          {/* Main Heading */}
          <h1
            className="font-display text-4xl sm:text-5xl md:text-6xl leading-[1.1] font-extrabold tracking-tight"
            style={{ color: "var(--text-primary)" }}
          >
            Hi, I'm{" "}
            <span className="heading-accent" style={{ color: "var(--accent)" }}>
              {profile.name}
            </span>
          </h1>

          {/* Bio text */}
          <p
            className="text-base md:text-lg max-w-xl leading-relaxed"
            style={{ color: "var(--text-secondary)" }}
          >
            {profile.bio}
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-wrap items-center gap-4 pt-2">
            <a
              href="#projects"
              className="btn-primary inline-flex items-center gap-2 px-7 py-3.5 rounded-full font-bold text-sm"
            >
              Explore Work
              <FiArrowDownRight size={16} />
            </a>

            <a
              href={profile.resumeUrl}
              download
              className="glass pill-hover inline-flex items-center gap-2 px-6 py-3.5 rounded-full font-semibold text-sm border"
              style={{
                borderColor: "var(--glass-border)",
                color: "var(--text-primary)",
              }}
            >
              <FiDownload size={15} style={{ color: "var(--accent)" }} />
              Download CV
            </a>

            {/* Social Icons */}
            <div className="flex items-center gap-2.5 pl-1">
              {[
                { href: profile.socials.github, icon: <FaGithub />, label: "GitHub" },
                { href: profile.socials.linkedin, icon: <FaLinkedin />, label: "LinkedIn" },
                { href: profile.socials.email, icon: <FaEnvelope />, label: "Email" },
              ].map((s) => (
                <a
                  key={s.label}
                  href={s.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  title={s.label}
                  aria-label={s.label}
                  className="glass icon-ring w-11 h-11 grid place-items-center rounded-full text-base hover:scale-110 hover:-translate-y-1 transition-all"
                  style={{ color: "var(--text-primary)" }}
                >
                  {s.icon}
                </a>
              ))}
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN — Profile Image & Interactive Tech Floaties */}
        <div className="reveal flex justify-center lg:justify-end relative" style={{ transitionDelay: "150ms" }}>
          <div className="relative animate-float">
            {/* Subtle Clean Ambient Aura */}
            <div
              className="absolute -inset-4 rounded-full blur-2xl opacity-20 pointer-events-none"
              style={{ background: "var(--accent)" }}
            />

            {/* Profile Avatar with Clean Crisp Border */}
            <div className="relative p-1 rounded-full border border-[var(--glass-border)] shadow-xl bg-[var(--bg-surface)]">
              <img
                src={profileImg}
                alt={profile.name}
                width="320"
                height="320"
                fetchPriority="high"
                decoding="async"
                className="w-60 h-60 sm:w-72 sm:h-72 md:w-80 md:h-80 object-cover rounded-full bg-slate-900"
              />
            </div>

            {/* Floating Tech Chips with Animated Cycling Roles (100% Centered on Top) */}
            <div className="hidden sm:flex absolute -top-6 inset-x-0 justify-center z-20 pointer-events-none">
              <div
                className="glass animate-float flex items-center gap-2.5 px-4 py-2.5 shadow-xl pointer-events-auto whitespace-nowrap"
                style={{ animationDelay: "0.5s" }}
              >
                <div className="flex items-center gap-1.5 text-cyan-400 shrink-0">
                  <FaReact size={18} />
                </div>
                <div className="flex items-center gap-1.5 text-emerald-400 shrink-0">
                  <FaNodeJs size={18} />
                </div>
                <div className="flex items-center gap-1.5 text-green-500 shrink-0">
                  <SiMongodb size={18} />
                </div>
                <div
                  className="pl-2.5 border-l overflow-hidden h-5 flex items-center shrink-0 min-w-[140px]"
                  style={{ borderColor: "var(--glass-border)" }}
                >
                  <span
                    key={roleIndex}
                    className="text-xs font-bold whitespace-nowrap animate-in fade-in slide-in-from-bottom-2 duration-300"
                    style={{ color: "var(--text-primary)" }}
                  >
                    {profile.roles[roleIndex]}
                  </span>
                </div>
              </div>
            </div>

            {/* Floating Live Code Terminal Card (At Bottom Left) */}
            <div
              className="glass animate-float-slow hidden sm:block absolute -bottom-6 -left-8 md:-left-12 w-52 p-4 font-mono text-[11px] leading-relaxed shadow-2xl z-10"
              style={{ animationDelay: "1s" }}
            >
              <div className="flex gap-1.5 mb-2.5">
                <span className="w-2.5 h-2.5 rounded-full bg-rose-500/80" />
                <span className="w-2.5 h-2.5 rounded-full bg-amber-500/80" />
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500/80" />
              </div>
              <p style={{ color: "var(--text-secondary)" }}>
                <span style={{ color: "var(--accent-violet)" }}>const</span> engineer = {"{"}
              </p>
              <p className="pl-3" style={{ color: "var(--text-secondary)" }}>
                stack: <span style={{ color: "var(--accent)" }}>'MERN'</span>,
              </p>
              <p className="pl-3" style={{ color: "var(--text-secondary)" }}>
                apis: <span style={{ color: "var(--accent)" }}>'RESTful'</span>,
              </p>
              <p className="pl-3" style={{ color: "var(--text-secondary)" }}>
                status: <span style={{ color: "var(--accent-emerald)" }}>'Building'</span>
              </p>
              <p style={{ color: "var(--text-secondary)" }}>
                {"}"}
                <span className="blink-cursor" style={{ color: "var(--accent)" }}>▍</span>
              </p>
            </div>

            {/* Mini Achievement Badge (Right Side Vertically Centered) */}
            <div
              className="glass animate-float-slow hidden md:flex absolute top-1/2 -translate-y-1/2 -right-8 md:-right-14 items-center gap-2 px-3.5 py-2 shadow-lg z-10"
              style={{ animationDelay: "2s" }}
            >
              <FiCheckCircle size={16} className="text-emerald-400" />
              <span className="text-[11px] font-semibold whitespace-nowrap" style={{ color: "var(--text-primary)" }}>
                CGPA 8.9 / 10
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;

