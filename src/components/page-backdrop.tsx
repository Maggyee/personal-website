// A blurred copy of the street behind every section, one layer per theme so
// switching themes crossfades instead of jumping.
export function PageBackdrop() {
  return (
    <div className="page-backdrop" aria-hidden>
      <span className="backdrop-ice" />
      <span className="backdrop-dusk" />
      <span className="backdrop-night" />
    </div>
  );
}
