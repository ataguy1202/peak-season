export function Brand({ size = 26 }: { size?: number }) {
  return (
    <div className="flex items-center gap-2.5">
      <span style={{ fontSize: size }}>🧺</span>
      <span className="display text-ink" style={{ fontSize: size * 0.72 }}>
        Peak Season
      </span>
    </div>
  );
}
