import { skills } from "../data";
import { useReveal } from "../hooks/useReveal";
import { getSkillIcon } from "./skillIcons";

const Skills = () => {
  const ref = useReveal();

  return (
    <section id="skills" className="section-tint tint-amber py-20 px-4">
      <div ref={ref} className="max-w-6xl mx-auto">
        <div className="reveal mb-10 text-center">
          <p className="font-mono text-xs tracking-[0.3em] uppercase mb-2" style={{ color: "var(--accent)" }}>
            Toolbox
          </p>
          <h2 className="font-display text-4xl md:text-5xl font-semibold heading-accent inline-block" style={{ color: "var(--text-primary)" }}>
            Skills
          </h2>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {skills.map((group, i) => (
            <div
              key={group.category}
              className="reveal card-hover glass p-6"
              style={{ transitionDelay: `${i * 80}ms` }}
            >
              <h3
                className="font-display text-lg font-semibold mb-4"
                style={{ color: "var(--accent)" }}
              >
                {group.category}
              </h3>
              <div className="flex flex-wrap gap-2">
                {group.items.map((item) => {
                  const Icon = getSkillIcon(item);
                  return (
                    <span
                      key={item}
                      className="pill-hover inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-full border"
                      style={{
                        borderColor: "var(--glass-border)",
                        color: "var(--text-secondary)",
                      }}
                    >
                      <Icon size={13} />
                      {item}
                    </span>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Skills;
