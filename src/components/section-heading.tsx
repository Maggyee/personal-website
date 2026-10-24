export function SectionHeading({
  jp,
  title,
  intro,
  action,
}: {
  jp: string;
  title: string;
  intro?: string;
  action?: React.ReactNode;
}) {
  return (
    <div className="section-head reveal-motion">
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
