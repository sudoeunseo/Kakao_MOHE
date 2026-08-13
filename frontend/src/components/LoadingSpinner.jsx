function LoadingSpinner({ label = "불러오는 중입니다" }) {
  return (
    <div className="loading-state" role="status" aria-live="polite">
      <span className="spinner" aria-hidden="true" />
      <strong>{label}</strong>
      <span>잠시만 기다려 주세요.</span>
    </div>
  );
}

export default LoadingSpinner;
