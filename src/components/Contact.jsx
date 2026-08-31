import { useState } from "react";
import { FiSend, FiCheck, FiMail, FiGithub, FiLinkedin, FiMapPin, FiCopy, FiMessageSquare } from "react-icons/fi";
import { profile } from "../data";
import { useReveal } from "../hooks/useReveal";

const Contact = () => {
  const ref = useReveal();
  const [form, setForm] = useState({ name: "", email: "", message: "" });
  const [sent, setSent] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleCopyEmail = () => {
    navigator.clipboard.writeText(profile.email);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const subject = encodeURIComponent(`Portfolio Inquiry from ${form.name}`);
    const body = encodeURIComponent(
      `Hi Dhiraj,\n\n${form.message}\n\nFrom:\n${form.name}\n${form.email}`
    );
    window.location.href = `mailto:${profile.email}?subject=${subject}&body=${body}`;
    setSent(true);
    setTimeout(() => setSent(false), 4000);
  };

  const githubHandle = profile.socials.github.split("/").filter(Boolean).pop();

  const infoCards = [
    {
      icon: <FiMail size={18} />,
      label: "Email",
      value: profile.email,
      note: "Click to copy or send mail",
      href: profile.socials.email,
      action: "copy",
    },
    {
      icon: <FiLinkedin size={18} />,
      label: "LinkedIn",
      value: profile.name,
      note: "Let's connect professionally",
      href: profile.socials.linkedin,
      action: "link",
    },
    {
      icon: <FiGithub size={18} />,
      label: "GitHub",
      value: `@${githubHandle}`,
      note: "Explore repositories & code",
      href: profile.socials.github,
      action: "link",
    },
  ];

  return (
    <section id="contact" className="section-tint tint-cyan py-24 px-4">
      <div ref={ref} className="max-w-6xl mx-auto">
        {/* Section Header */}
        <div className="reveal mb-16 flex flex-col items-center justify-center text-center space-y-3">
          <div
            className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border text-xs font-mono tracking-widest uppercase font-semibold"
            style={{
              borderColor: "var(--glass-border)",
              color: "var(--accent)",
              background: "var(--glass-bg)",
            }}
          >
            <FiMessageSquare size={13} />
            <span>Get in Touch</span>
          </div>

          <h2
            className="font-display text-4xl md:text-5xl font-extrabold heading-accent inline-block mx-auto"
            style={{ color: "var(--text-primary)" }}
          >
            Contact
          </h2>
        </div>

        <div className="grid lg:grid-cols-[0.85fr_1.15fr] gap-8 items-start">
          {/* LEFT: Contact Cards */}
          <div className="reveal space-y-4" style={{ transitionDelay: "80ms" }}>
            {infoCards.map((card, i) => {
              if (card.action === "copy") {
                return (
                  <div
                    key={card.label}
                    onClick={handleCopyEmail}
                    className="card-hover glass flex items-center justify-between p-5 rounded-2xl cursor-pointer group"
                    style={{ transitionDelay: `${i * 60}ms` }}
                  >
                    <div className="flex items-center gap-4 min-w-0">
                      <span className="w-12 h-12 shrink-0 grid place-items-center rounded-2xl bg-[var(--accent)] text-white shadow-sm">
                        {card.icon}
                      </span>
                      <div className="min-w-0">
                        <span className="block font-display text-sm font-bold text-[var(--text-primary)]">
                          {card.label}
                        </span>
                        <span className="block text-sm font-semibold truncate text-[var(--accent)]">
                          {card.value}
                        </span>
                        <span className="block text-xs text-[var(--text-muted)] mt-0.5">
                          {card.note}
                        </span>
                      </div>
                    </div>

                    <button
                      type="button"
                      aria-label="Copy email address"
                      className={`glass icon-ring px-3 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 shrink-0 border border-[var(--glass-border)] transition-all duration-200 ${
                        copied
                          ? "opacity-100 scale-100 border-emerald-500/50"
                          : "opacity-0 scale-95 group-hover:opacity-100 group-hover:scale-100 group-hover:border-[var(--accent)]"
                      }`}
                    >
                      {copied ? (
                        <>
                          <FiCheck size={13} className="text-emerald-400" />
                          <span className="text-emerald-400">Copied!</span>
                        </>
                      ) : (
                        <>
                          <FiCopy size={13} style={{ color: "var(--accent)" }} />
                          <span style={{ color: "var(--text-secondary)" }}>Copy</span>
                        </>
                      )}
                    </button>
                  </div>
                );
              }

              return (
                <a
                  key={card.label}
                  href={card.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="card-hover glass flex items-center justify-between p-5 rounded-2xl group"
                  style={{ transitionDelay: `${i * 60}ms` }}
                >
                  <div className="flex items-center gap-4 min-w-0">
                    <span className="w-12 h-12 shrink-0 grid place-items-center rounded-2xl bg-[var(--accent)] text-white shadow-sm">
                      {card.icon}
                    </span>
                    <div className="min-w-0">
                      <span className="block font-display text-sm font-bold text-[var(--text-primary)]">
                        {card.label}
                      </span>
                      <span className="block text-sm font-semibold truncate text-[var(--accent)]">
                        {card.value}
                      </span>
                      <span className="block text-xs text-[var(--text-muted)] mt-0.5">
                        {card.note}
                      </span>
                    </div>
                  </div>
                  <span className="text-xs font-semibold text-[var(--accent)] opacity-0 group-hover:opacity-100 transition-opacity">
                    Visit →
                  </span>
                </a>
              );
            })}

            {/* Location Pill */}
            <div
              className="glass flex items-center gap-3 px-5 py-4 rounded-2xl text-xs sm:text-sm font-semibold border"
              style={{
                borderColor: "var(--glass-border)",
                color: "var(--text-primary)",
              }}
            >
              <div className="w-2.5 h-2.5 rounded-full bg-emerald-400 radar-beacon" />
              <FiMapPin className="text-[var(--accent)]" />
              <span>Available for Work / Relocation • {profile.location}</span>
            </div>
          </div>

          {/* RIGHT: Direct Message Form */}
          <form
            onSubmit={handleSubmit}
            className="reveal card-hover glass p-7 sm:p-9 rounded-3xl space-y-5"
            style={{ transitionDelay: "140ms" }}
          >
            <div>
              <label className="block text-xs font-mono font-bold uppercase tracking-wider mb-2 text-[var(--text-secondary)]">
                Your Name
              </label>
              <input
                type="text"
                name="name"
                required
                value={form.name}
                onChange={handleChange}
                placeholder="John Doe"
                className="w-full border rounded-2xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--accent)] transition-all glass"
                style={{
                  borderColor: "var(--glass-border)",
                  color: "var(--text-primary)",
                }}
              />
            </div>

            <div>
              <label className="block text-xs font-mono font-bold uppercase tracking-wider mb-2 text-[var(--text-secondary)]">
                Email Address
              </label>
              <input
                type="email"
                name="email"
                required
                value={form.email}
                onChange={handleChange}
                placeholder="john@example.com"
                className="w-full border rounded-2xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--accent)] transition-all glass"
                style={{
                  borderColor: "var(--glass-border)",
                  color: "var(--text-primary)",
                }}
              />
            </div>

            <div>
              <label className="block text-xs font-mono font-bold uppercase tracking-wider mb-2 text-[var(--text-secondary)]">
                Message / Opportunity
              </label>
              <textarea
                name="message"
                rows="4"
                required
                value={form.message}
                onChange={handleChange}
                placeholder="Hi Dhiraj, I'd like to discuss a project or role..."
                className="w-full border rounded-2xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--accent)] transition-all resize-none glass"
                style={{
                  borderColor: "var(--glass-border)",
                  color: "var(--text-primary)",
                }}
              />
            </div>

            <button
              type="submit"
              className="btn-primary btn-shine w-full py-3.5 rounded-2xl font-bold text-sm inline-flex items-center justify-center gap-2"
            >
              {sent ? (
                <>
                  <FiCheck size={16} /> Opening Email Client...
                </>
              ) : (
                <>
                  <FiSend size={16} /> Send Direct Message
                </>
              )}
            </button>
          </form>
        </div>
      </div>
    </section>
  );
};

export default Contact;

