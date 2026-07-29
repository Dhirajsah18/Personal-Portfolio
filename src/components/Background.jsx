// Fixed, decorative animated background — soft drifting gradient orbs
// plus a faint dot-grid texture. Purely visual, sits behind all content.
const Background = () => (
  <>
    <div className="bg-orbs" aria-hidden="true">
      <span className="orb-1" />
      <span className="orb-2" />
      <span className="orb-3" />
    </div>
    <div className="bg-grid" aria-hidden="true" />
  </>
);

export default Background;
