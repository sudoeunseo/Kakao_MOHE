/** @type {import('tailwindcss').Config} */
export default {
  content: ["./src/**/*.{js,ts,jsx,tsx}"],
  corePlugins: {
    preflight: false,
  },
  theme: {
    extend: {
      colors: {
        "kakao-navy": "#1e2a44",
        "kakao-yellow": "#ffcd00",
        "surface-ice": "#f8f9fb",
        "deep-gray": "#191919",
        "border-subtle": "#e1e2e4",
        primary: "#08152e",
        "primary-container": "#1e2a44",
        "on-primary-container": "#8591b0",
      },
      fontFamily: {
        sans: ["Plus Jakarta Sans", "Pretendard", "Noto Sans KR", "system-ui", "sans-serif"],
      },
    },
  },
};
