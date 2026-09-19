import { useState, useEffect } from "react";
import { FaLinkedin, FaGithub, FaEnvelope, FaReact, FaNodeJs } from "react-icons/fa";
import { SiMongodb } from "react-icons/si";
import { FiArrowDownRight, FiDownload, FiCheckCircle } from "react-icons/fi";
import profileImg from "../assets/profile.webp";
import { profile } from "../data";
import { useReveal } from "../hooks/useReveal";
import { api } from "../services/api";

const Hero = ({ resumeUrl }) => {
  const ref = useReveal();
  const [roleIndex, setRoleIndex] = useState(0);

  const activeResumeUrl = resumeUrl || profile.resumeUrl;

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
      className="section-tint flex items-center pt-24 pb-12 sm:pt-32 sm:pb-16 px-4 sm:px-6"
    >
      <div className="max-w-6xl mx-auto w-full glass p-6 sm:p-10 md:p-12 lg:p-14 grid lg:grid-cols-[1.2fr_0.8fr] gap-8 lg:gap-12 items-center rounded-3xl md:rounded-[2.5rem] shadow-2xl border border-[var(--glass-border)]">
        {/* LEFT COLUMN */}
        <div className="reveal space-y-6">
          {/* Status Badge */}
          <div
            className="inline-flex items-center gap-2.5 px-4 py-1.5 rounded-full border text-xs font-semibold shadow-sm"
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
            className="font-display text-3xl sm:text-4xl md:text-5xl leading-tight font-extrabold tracking-tight"
            style={{ color: "var(--text-primary)" }}
          >
            Hi, I'm{" "}
            <span className="heading-accent inline-block" style={{ color: "var(--accent)" }}>
              {profile.name}
            </span>
          </h1>

          {/* Bio text */}
          <div className="max-w-3xl">
            <p className="text-base sm:text-lg leading-relaxed text-stone-700 dark:text-slate-200 font-normal">
              {profile.bio}
            </p>
          </div>

          {/* CTA Buttons & Social Links */}
          <div className="flex flex-wrap items-center gap-4 pt-3">
            <a
              href="#projects"
              className="btn-primary inline-flex items-center gap-2 px-8 py-4 rounded-full font-bold text-sm shadow-lg hover:scale-105 transition-transform"
            >
              Explore Work
              <FiArrowDownRight size={17} />
            </a>

            <a
              href={activeResumeUrl}
              download
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => api.trackResumeDownload()}
              className="glass pill-hover inline-flex items-center gap-2 px-7 py-4 rounded-full font-semibold text-sm border shadow-sm"
              style={{
                borderColor: "var(--glass-border)",
                color: "var(--text-primary)",
              }}
            >
              <FiDownload size={16} style={{ color: "var(--accent)" }} />
              Download CV
            </a>

            {/* Social Icons */}
            <div className="flex items-center gap-2.5 pl-1 sm:pl-2">
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
                  className="glass icon-ring w-12 h-12 grid place-items-center rounded-full text-lg hover:scale-110 hover:-translate-y-1 transition-all"
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
            {/* Ambient Aura */}
            <div
              className="absolute -inset-6 rounded-full blur-3xl opacity-25 pointer-events-none"
              style={{ background: "var(--accent)" }}
            />

            {/* Profile Avatar Frame */}
            <div className="relative p-1.5 rounded-full border border-[var(--glass-border)] shadow-2xl bg-[var(--bg-surface)]">
              <img
                src={profileImg}
                alt={profile.name}
                width="360"
                height="360"
                fetchPriority="high"
                decoding="async"
                className="w-64 h-64 sm:w-80 sm:h-80 md:w-88 md:h-88 lg:w-96 lg:h-96 object-cover rounded-full bg-slate-900 shadow-inner"
              />
            </div>

            {/* Floating Tech Chips with Animated Cycling Roles (Centered on Top) */}
            <div className="hidden sm:flex absolute -top-5 inset-x-0 justify-center z-20 pointer-events-none">
              <div
                className="glass animate-float flex items-center gap-2.5 px-4 py-2.5 rounded-2xl shadow-xl pointer-events-auto whitespace-nowrap border border-[var(--glass-border)]"
                style={{ animationDelay: "0.5s" }}
              >
                <div className="flex items-center gap-1.5 text-cyan-400 shrink-0">
                  <FaReact size={19} />
                </div>
                <div className="flex items-center gap-1.5 text-emerald-400 shrink-0">
                  <FaNodeJs size={19} />
                </div>
                <div className="flex items-center gap-1.5 text-green-500 shrink-0">
                  <SiMongodb size={19} />
                </div>
                <div
                  className="pl-2.5 border-l overflow-hidden h-5 flex items-center shrink-0 min-w-[145px]"
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

            {/* Mini Achievement Badge (Bottom Right) */}
            <div
              className="glass animate-float-slow hidden md:flex absolute -bottom-2 right-2 items-center gap-2 px-4 py-2.5 rounded-2xl shadow-lg z-10 border border-[var(--glass-border)]"
              style={{ animationDelay: "1.5s" }}
            >
              <FiCheckCircle size={17} className="text-emerald-400" />
              <span className="text-xs font-semibold whitespace-nowrap" style={{ color: "var(--text-primary)" }}>
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
