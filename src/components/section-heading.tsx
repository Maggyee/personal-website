export function SectionHeading({
  jp,
  title,
  mark,
  intro,
  action,
}: {
  jp: string;
  title: string;
  // Oversized outline word that drifts behind the heading while scrolling.
  mark: string;
  intro?: string;
  action?: React.ReactNode;
}) {
  return (
    <div className="section-head reveal-motion">
      <span className="section-mark" aria-hidden>
        {mark}
      </span>
      <div>
        <p className="section-jp">
          <span className="section-flake" aria-hidden>
            ❄
          </span>
          {jp}
        </p>
        <h2 className="section-title">{title}</h2>
        {intro ? <p className="section-intro">{intro}</p> : null}
      </div>
      {action ? <div className="section-action">{action}</div> : null}
    </div>
  );
}
