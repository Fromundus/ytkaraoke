/** @type {import('tailwindcss').Config} */
module.exports = {
    darkMode: 'class',
    content: ["./src/**/*.{html,js,jsx}"],
  theme: {
    extend: {
        colors: {
            background: '#0f0f1a',     // Dark background
            surface: '#1a1a2e',        // Slightly lighter surface (cards, navs)
            primary: '#ef4444',        // Red-500 (main red)
            primaryHover: '#dc2626',   // Red-600 (hover state)
            secondary: '#f87171',      // Red-400 (complementary/secondary)
            accent: '#f43f5e',         // Rose-500 (call to action or highlight)
            textPrimary: '#e5e7eb',    // Gray-200 (light text)
            textSecondary: '#9ca3af',  // Gray-400 (subtle text)
            border: '#2e2e3e',         // Dark border
            tertiary: '#ed9c07',       // Warm accent (kept as-is for contrast)

            light: {
                background: "#ffffff",          // Pure White
                foreground: "#111111",          // Almost Black
                primary: "#333333",             // Dark Gray
                secondary: "#939393",           // Medium Gray
                accent: "#e7e7e7",              // Light Gray
                muted: "#f5f5f5",               // Soft White
                line: "#D4D4D4",
                hover: "#c5c5c5"
            },
            // Dark Mode Colors (Neutral)
            dark: {
                background: "#1c1c1d",          // Pure Black
                foreground: "#e2e5e9",          // Soft White
                primary: "#999999",             // Light Gray
                secondary: "#666666",           // Medium Gray
                accent: "#252728",              // Dark Gray
                muted: "#1a1a1a",               // Very Dark Gray
                line: "#404040",
                hover: "#4f5152"
            },
        }
    },
  },
  variants: {
    extend: {
        display: ["print"],
    }
  },
  plugins: [
    require('@tailwindcss/forms'),
  ],
}

