const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:4000";

export function getApiUrl(path) {
  return `${API_BASE_URL}${path}`;
}

export async function api(path, options = {}) {
  let response;

  try {
    response = await fetch(getApiUrl(path), {
      ...options,
      headers: {
        "Content-Type": "application/json",
        ...options.headers,
      },
    });
  } catch {
    throw new Error("서버에 연결할 수 없습니다. 백엔드 실행 상태를 확인해 주세요.");
  }

  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    throw new Error(data.error || "요청에 실패했습니다.");
  }

  return data;
}

export function formatWon(value) {
  return `${new Intl.NumberFormat("ko-KR").format(Math.round(Number(value) || 0))}원`;
}

export function formatDate(value) {
  if (!value) return "-";
  const normalized = value.includes("T") ? value : `${value.replace(" ", "T")}Z`;
  return new Intl.DateTimeFormat("ko-KR", {
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(normalized));
}
