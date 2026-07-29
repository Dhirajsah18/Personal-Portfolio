import { useState } from "react";
import { FiSend, FiCheck, FiMail, FiGithub, FiLinkedin, FiMapPin } from "react-icons/fi";
import { profile } from "../data";
import { useReveal } from "../hooks/useReveal";

const Contact = () => {
  const ref = useReveal();
  const [form, setForm] = useState({ name: "", email: "", message: "" });
  const [sent, setSent] = useState(false);

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = (e) => {
    e.preventDefault();
    const subject = encodeURIComponent(`Portfolio inquiry from ${form.name}`);
    const body = encodeURIComponent(
      `${form.message}\n\n— ${form.name} (${form.email})`
    );
    window.location.href = `mailto:${profile.email}?subject=${subject}&body=${body}`;
    setSent(true);
    setTimeout(() => setSent(false), 3000);
  };

  const inputStyle = {
    background: "transparent",
    borderColor: "var(--glass-border)",
    color: "var(--text-primary)",
  };

  const githubHandle = profile.socials.github.split("/").filter(Boolean).pop();
  const country = profile.location.split(",").pop().trim();

  const infoCards = [
    {
      icon: <FiMail size={18} />,
      label: "Email",
      value: profile.email,
      note: "Best for detailed inquiries",
      href: profile.socials.email,
    },
    {
      icon: <FiGithub size={18} />,
      label: "GitHub",
      value: `@${githubHandle}`,
      note: "Check out my code",
      href: profile.socials.github,
    },
    {
      icon: <FiLinkedin size={18} />,
      label: "LinkedIn",
      value: profile.name,
      note: "Let's connect professionally",
      href: profile.socials.linkedin,
    },
  ];

  return (
    <section id="contact" className="section-tint tint-mint py-20 px-4">
      <div ref={ref} className="max-w-6xl mx-auto">
        <div className="reveal mb-12 text-center">
          <p className="font-mono text-xs tracking-[0.3em] uppercase mb-2" style={{ color: "var(--accent)" }}>
            Get in touch
          </p>
          <h2 className="font-display text-4xl md:text-5xl font-semibold heading-accent inline-block" style={{ color: "var(--text-primary)" }}>
            Contact
          </h2>
          <p className="text-sm mt-4 max-w-xl mx-auto" style={{ color: "var(--text-secondary)" }}>
            Have an opening, a project in mind, or just want to say hello? I'd love to hear from you.
          </p>
        </div>

        <div className="grid md:grid-cols-[0.85fr_1.15fr] gap-6 items-start">
          {/* LEFT: contact info */}
          <div className="reveal space-y-4" style={{ transitionDelay: "80ms" }}>
            {infoCards.map((card, i) => (
              <a
                key={card.label}
                href={card.href}
                target={card.label === "Email" ? undefined : "_blank"}
                rel="noopener noreferrer"
                className="card-hover glass flex items-start gap-4 p-5"
                style={{ transitionDelay: `${i * 60}ms` }}
              >
                <span
                  className="w-11 h-11 shrink-0 grid place-items-center rounded-xl"
                  style={{ background: "var(--accent)", color: "var(--bg-base)" }}
                >
                  {card.icon}
                </span>
                <span className="min-w-0">
                  <span className="block font-display text-base font-semibold mb-0.5" style={{ color: "var(--text-primary)" }}>
                    {card.label}
                  </span>
                  <span className="block text-sm truncate" style={{ color: "var(--accent)" }}>
                    {card.value}
                  </span>
                  <span className="block text-xs mt-0.5" style={{ color: "var(--text-secondary)" }}>
                    {card.note}
                  </span>
                </span>
              </a>
            ))}

            <div
              className="glass flex items-center gap-2 px-5 py-4 text-sm font-semibold"
              style={{ color: "var(--accent)" }}
            >
              <FiMapPin /> Open for Work in {country}
            </div>
          </div>

          {/* RIGHT: message form */}
          <form
            onSubmit={handleSubmit}
            className="reveal card-hover glass p-8 md:p-10 space-y-5"
            style={{ transitionDelay: "140ms" }}
          >
            <input
              type="text"
              name="name"
              required
              value={form.name}
              onChange={handleChange}
              placeholder="Your name"
              className="w-full border rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--accent)] transition-shadow"
              style={inputStyle}
            />
            <input
              type="email"
              name="email"
              required
              value={form.email}
              onChange={handleChange}
              placeholder="you@example.com"
              className="w-full border rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--accent)] transition-shadow"
              style={inputStyle}
            />
            <textarea
              name="message"
              rows="5"
              required
              value={form.message}
              onChange={handleChange}
              placeholder="What would you like to talk about?"
              className="w-full border rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--accent)] transition-shadow resize-none"
              style={inputStyle}
            />
            <button
              type="submit"
              className="btn-shine w-full inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl font-semibold text-sm transition-transform hover:scale-[1.02]"
              style={{ background: "linear-gradient(100deg, var(--accent), var(--accent-2))", color: "var(--bg-base)" }}
            >
              {sent ? (
                <>
                  <FiCheck /> Opening your mail app...
                </>
              ) : (
                <>
                  <FiSend /> Send Message
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
