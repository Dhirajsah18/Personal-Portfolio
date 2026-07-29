import { education } from "../data";
import { useReveal } from "../hooks/useReveal";

const Education = () => {
  const ref = useReveal();

  return (
    <section id="education" className="section-tint tint-amber py-20 px-4">
      <div ref={ref} className="max-w-4xl mx-auto">
        <div className="reveal mb-12 text-center">
          <p className="font-mono text-xs tracking-[0.3em] uppercase mb-2" style={{ color: "var(--accent)" }}>
            Academics
          </p>
          <h2 className="font-display text-4xl md:text-5xl font-semibold heading-accent inline-block" style={{ color: "var(--text-primary)" }}>
            Education
          </h2>
        </div>

        <div className="relative pl-8 md:pl-0">
          <div
            className="absolute left-8 md:left-1/2 top-0 bottom-0 w-px md:-translate-x-1/2"
            style={{ background: "linear-gradient(180deg, var(--accent), var(--accent-2), transparent)" }}
          />

          <div className="space-y-8">
            {education.map((edu, index) => (
              <div
                key={index}
                className={`reveal relative md:flex ${
                  index % 2 === 0 ? "md:flex-row" : "md:flex-row-reverse"
                }`}
                style={{ transitionDelay: `${index * 100}ms` }}
              >
                <div
                  className="glow-pulse absolute left-8 md:left-1/2 top-6 w-3 h-3 rounded-full -translate-x-1/2 z-10"
                  style={{ background: "var(--accent)" }}
                />
                <div className="md:w-1/2" />
                <div className={`md:w-1/2 ${index % 2 === 0 ? "md:pl-10" : "md:pr-10"}`}>
                  <div className="card-hover glass p-6">
                    <p className="font-mono text-xs mb-1" style={{ color: "var(--accent)" }}>
                      {edu.year}
                    </p>
                    <h3 className="font-display text-xl font-semibold mb-1" style={{ color: "var(--text-primary)" }}>
                      {edu.degree}
                    </h3>
                    <p className="text-sm font-semibold mb-1" style={{ color: "var(--text-secondary)" }}>
                      {edu.institution}
                    </p>
                    <p className="text-xs" style={{ color: "var(--text-secondary)" }}>
                      {edu.details}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Education;
