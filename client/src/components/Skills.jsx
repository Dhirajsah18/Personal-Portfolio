import { useState, useEffect } from "react";
import { useReveal } from "../hooks/useReveal";
import { getSkillIcon, getSkillColor } from "./skillIcons";
import { FiCode, FiLayers } from "react-icons/fi";
import { api } from "../services/api";

const Skills = ({ refreshTrigger }) => {
  const [activeTab, setActiveTab] = useState("all");
  const [skillList, setSkillList] = useState([]);
  const [loading, setLoading] = useState(true);
  const ref = useReveal([skillList, activeTab, loading]);

  useEffect(() => {
    let isMounted = true;
    api.getSkills()
      .then((data) => {
        if (isMounted) {
          if (Array.isArray(data)) {
            setSkillList(data);
          }
          setLoading(false);
        }
      })
      .catch((err) => {
        console.error("Failed to load skills:", err.message);
        if (isMounted) {
          setLoading(false);
        }
      });
    return () => { isMounted = false; };
  }, [refreshTrigger]);

  const filterOptions = [
    { id: "all", label: "All Skills" },
    { id: "frontend", label: "Frontend" },
    { id: "backend", label: "Backend & APIs" },
    { id: "database", label: "Databases" },
    { id: "languages", label: "Languages" },
    { id: "tools", label: "Tools" },
  ];

  const filteredSkills =
    activeTab === "all"
      ? skillList
      : skillList.filter((group) => group.tag === activeTab);

  return (
    <section id="skills" className="section-tint tint-violet py-16 sm:py-20 px-4">
      <div ref={ref} className="max-w-6xl mx-auto">
        {/* Section Header */}
        <div className="reveal mb-10 flex flex-col items-center justify-center text-center space-y-2.5">
          <div
            className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full border text-xs font-mono tracking-widest uppercase font-semibold"
            style={{
              borderColor: "var(--glass-border)",
              color: "var(--accent)",
              background: "var(--glass-bg)",
            }}
          >
            <FiLayers size={13} />
            <span>Technical Capabilities</span>
          </div>

          <h2
            className="font-display text-4xl md:text-5xl font-extrabold heading-accent inline-block mx-auto"
            style={{ color: "var(--text-primary)" }}
          >
            Skills
          </h2>
        </div>

        {/* Filter Tabs */}
        <div className="reveal flex flex-wrap justify-center gap-2 mb-8">
          {filterOptions.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-4 py-1.5 rounded-full text-xs font-semibold transition-all duration-200 border ${
                activeTab === tab.id
                  ? "bg-[var(--accent)] text-white border-transparent shadow-md scale-105"
                  : "glass border-[var(--glass-border)] text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:border-[var(--accent)]"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Bento Grid */}
        {loading ? (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {[1, 2, 3, 4, 5, 6].map((n) => (
              <div
                key={n}
                className="glass p-6 rounded-3xl animate-pulse space-y-4"
                style={{ borderColor: "var(--glass-border)" }}
              >
                <div className="flex items-center gap-2">
                  <div className="w-2.5 h-2.5 rounded-full bg-slate-400/30 dark:bg-slate-700/50" />
                  <div className="h-5 w-28 rounded-lg bg-slate-400/20 dark:bg-slate-700/40" />
                </div>
                <div className="flex flex-wrap gap-2 pt-1">
                  <div className="h-7 w-20 rounded-xl bg-slate-400/15 dark:bg-slate-700/30" />
                  <div className="h-7 w-16 rounded-xl bg-slate-400/15 dark:bg-slate-700/30" />
                  <div className="h-7 w-24 rounded-xl bg-slate-400/15 dark:bg-slate-700/30" />
                  <div className="h-7 w-18 rounded-xl bg-slate-400/15 dark:bg-slate-700/30" />
                  <div className="h-7 w-20 rounded-xl bg-slate-400/15 dark:bg-slate-700/30" />
                </div>
              </div>
            ))}
          </div>
        ) : filteredSkills.length > 0 ? (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {filteredSkills.map((group, i) => (
              <div
                key={group.category || i}
                className="reveal card-hover glass p-6 rounded-3xl flex flex-col justify-start"
                style={{ transitionDelay: `${i * 60}ms` }}
              >
                <div className="flex items-center gap-2 mb-4">
                  <span className="w-2 h-2 rounded-full bg-[var(--accent)]" />
                  <h3
                    className="font-display text-base font-bold"
                    style={{ color: "var(--text-primary)" }}
                  >
                    {group.category}
                  </h3>
                </div>

                {/* Skill Pills */}
                <div className="flex flex-wrap gap-2">
                  {(group.items || []).map((item) => {
                    const Icon = getSkillIcon(item);
                    const brandColor = getSkillColor(item);

                    return (
                      <span
                        key={item}
                        className="pill-hover group inline-flex items-center gap-2 text-xs font-semibold px-3 py-1.5 rounded-xl border transition-all"
                        style={{
                          borderColor: "var(--glass-border)",
                          background: "var(--glass-bg)",
                          color: "var(--text-primary)",
                        }}
                      >
                        <span
                          className="transition-transform group-hover:scale-110"
                          style={{ color: brandColor }}
                        >
                          <Icon size={14} />
                        </span>
                        <span>{item}</span>
                      </span>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12 glass rounded-3xl p-8 max-w-md mx-auto">
            <FiLayers size={32} className="mx-auto mb-3 text-[var(--text-muted)] opacity-60" />
            <p className="text-sm font-semibold" style={{ color: "var(--text-secondary)" }}>
              No skills found in this category.
            </p>
          </div>
        )}
      </div>
    </section>
  );
};

export default Skills;

