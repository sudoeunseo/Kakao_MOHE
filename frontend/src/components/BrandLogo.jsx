function BrandLogo({ tone = "dark", compact = false, className = "" }) {
  return (
    <span
      className={`mohe-brand-logo ${tone === "light" ? "light" : "dark"} ${compact ? "compact" : ""} ${className}`.trim()}
      aria-label="Kakao MOHE"
    >
      <span className="mohe-brand-bubble" aria-hidden="true" />
      <span className="mohe-brand-wordmark"><strong>Kakao</strong> MOHE</span>
    </span>
  );
}

export default BrandLogo;
