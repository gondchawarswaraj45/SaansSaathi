/** @type {import('tailwindcss').Config} */
export default {
  darkMode: ["class"],
  content: [
    "./index.html",
    "./src/**/*.{ts,tsx,js,jsx}",
  ],
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      colors: {
        // SaansSaathi Brand Colors
        brand: {
          green: {
            50:  "#f0faf4",
            100: "#dcf5e7",
            200: "#bbead2",
            300: "#8ed9b4",
            400: "#5ac090",
            500: "#35a56e",
            600: "#2D6A4F", // PRIMARY
            700: "#245840",
            800: "#1e4834",
            900: "#19392b",
          },
          sky: {
            50:  "#f0fafe",
            100: "#ddf4fb",
            200: "#b4e9f7",
            300: "#7dd7f0",
            400: "#40B4C4", // SECONDARY
            500: "#2a9bb0",
            600: "#1f7d8f",
          },
          amber: {
            400: "#F4A261",
            500: "#e88d47",
          },
        },
        // AQI Category Colors (Indian CPCB Standard)
        aqi: {
          good:        "#55A630",
          satisfactory:"#A7C957",
          moderate:    "#F4A261",
          poor:        "#E76F51",
          verypoor:    "#D62828",
          severe:      "#6B0504",
        },
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      fontFamily: {
        sans: ["Inter", "system-ui", "-apple-system", "sans-serif"],
        mono: ["JetBrains Mono", "Consolas", "monospace"],
      },
      keyframes: {
        "accordion-down": {
          from: { height: "0" },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: "0" },
        },
        "aqi-pulse": {
          "0%, 100%": { opacity: "1", transform: "scale(1)" },
          "50%": { opacity: "0.6", transform: "scale(1.05)" },
        },
        "count-up": {
          "0%": { opacity: "0", transform: "translateY(10px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        "fade-in": {
          from: { opacity: "0", transform: "translateY(8px)" },
          to: { opacity: "1", transform: "translateY(0)" },
        },
        "slide-in-bottom": {
          from: { opacity: "0", transform: "translateY(20px)" },
          to: { opacity: "1", transform: "translateY(0)" },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
        "aqi-pulse": "aqi-pulse 2s ease-in-out infinite",
        "count-up": "count-up 0.5s ease-out forwards",
        "fade-in": "fade-in 0.3s ease-out",
        "slide-in-bottom": "slide-in-bottom 0.4s ease-out",
      },
    },
  },
  plugins: [],
}
