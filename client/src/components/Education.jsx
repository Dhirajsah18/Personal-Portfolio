import { education } from "../data";
import { useReveal } from "../hooks/useReveal";
import { FiAward, FiBook, FiCalendar } from "react-icons/fi";

const Education = () => {
  const ref = useReveal();

  return (
    <section id="education" className="section-tint tint-emerald py-24 px-4">
      <div ref={ref} className="max-w-4xl mx-auto">
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
            <FiBook size={13} />
            <span>Academic Journey</span>
          </div>

          <h2
            className="font-display text-4xl md:text-5xl font-extrabold heading-accent inline-block mx-auto"
            style={{ color: "var(--text-primary)" }}
          >
            Education
          </h2>
        </div>

        {/* Timeline */}
        <div className="relative pl-6 md:pl-0">
          {/* Central Gradient Line */}
          <div
            className="absolute left-6 md:left-1/2 top-4 bottom-4 w-[2px] md:-translate-x-1/2 rounded-full"
            style={{
              background: "linear-gradient(180deg, var(--accent), var(--accent-violet), transparent)",
            }}
          />

          <div className="space-y-10">
            {education.map((edu, index) => {
              const isEven = index % 2 === 0;
              return (
                <div
                  key={edu.degree}
                  className={`reveal relative flex flex-col ${
                    isEven ? "md:flex-row" : "md:flex-row-reverse"
                  } items-center`}
                  style={{ transitionDelay: `${index * 100}ms` }}
                >
                  {/* Timeline Pulse Node */}
                  <div
                    className="absolute left-6 md:left-1/2 top-8 w-4 h-4 rounded-full -translate-x-1/2 z-20 flex items-center justify-center"
                    style={{ background: "var(--accent)" }}
                  >
                    <span className="radar-beacon absolute w-7 h-7 rounded-full" style={{ background: "var(--accent)", opacity: 0.4 }} />
                    <span className="w-1.5 h-1.5 rounded-full bg-white" />
                  </div>

                  {/* Empty Spacer Column for Desktop */}
                  <div className="hidden md:block md:w-1/2" />

                  {/* Card Content Column */}
                  <div className={`w-full md:w-1/2 ${isEven ? "md:pl-10 pl-10" : "md:pr-10 pl-10"}`}>
                    <div className="card-hover glass p-6 sm:p-7 rounded-3xl space-y-4">
                      {/* Year & Badge Header */}
                      <div className="flex flex-wrap items-center justify-between gap-2">
                        <span
                          className="inline-flex items-center gap-1.5 font-mono text-xs font-bold px-3 py-1 rounded-full border"
                          style={{
                            borderColor: "var(--glass-border)",
                            color: "var(--accent)",
                            background: "var(--glass-bg)",
                          }}
                        >
                          <FiCalendar size={12} />
                          {edu.year}
                        </span>

                        <span
                          className="inline-flex items-center gap-1 text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
                        >
                          <FiAward size={12} />
                          {edu.score}
                        </span>
                      </div>

                      {/* Degree Title & Institution */}
                      <div>
                        <h3
                          className="font-display text-lg sm:text-xl font-bold"
                          style={{ color: "var(--text-primary)" }}
                        >
                          {edu.degree}
                        </h3>
                        <p
                          className="text-sm font-semibold mt-1"
                          style={{ color: "var(--accent-cyan)" }}
                        >
                          {edu.institution}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Education;

