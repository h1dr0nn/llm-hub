/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "var(--bg-color)",
        surface: "var(--bg-surface)",
        card: "var(--bg-card)",
        primary: {
          DEFAULT: "var(--primary)",
          hover: "var(--primary-hover)",
          glow: "var(--primary-glow)",
        },
        accent: {
          DEFAULT: "var(--accent)",
          glow: "var(--accent-glow)",
        },
        success: "var(--success)",
        warning: "var(--warning)",
        danger: "var(--danger)",
        text: {
          primary: "var(--text-primary)",
          secondary: "var(--text-secondary)",
        },
      },
      borderRadius: {
        sm: "var(--radius-sm)",
        md: "var(--radius-md)",
        lg: "var(--radius-lg)",
      },
      animation: {
        'fade-in': 'fadeIn 0.5s cubic-bezier(0.2, 0.8, 0.2, 1) forwards',
        'modal-enter': 'modalEnter 0.4s cubic-bezier(0.16, 1, 0.3, 1) forwards',
        'spin-slow': 'spin 3s linear infinite',
      },
      keyframes: {
        fadeIn: {
          from: { opacity: '0', transform: 'translateY(10px)' },
          to: { opacity: '1', transform: 'translateY(0)' },
        },
        modalEnter: {
          from: { opacity: '0', transform: 'scale(0.95) translateY(20px)' },
          to: { opacity: '1', transform: 'scale(1) translateY(0)' },
        },
      },
      boxShadow: {
        sm: "var(--shadow-sm)",
        md: "var(--shadow-md)",
        lg: "var(--shadow-lg)",
      },
    },
  },
  plugins: [],
};
