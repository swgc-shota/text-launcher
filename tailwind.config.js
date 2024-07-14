/** @type {import('tailwindcss').Config} */
export default {
  darkMode: "class",
  content: ["./(src|public)/**/*.(ts|html)", "./*.html"],
  theme: {
    fontSize: {
      xs: "12px",
      sm: "14px",
      base: "16px",
      lg: "18px",
      xl: "20px",
      "2xl": "24px",
      "3xl": "30px",
      "4xl": "36px",
      "5xl": "48px",
      "6xl": "60px",
    },
    spacing: {
      px: "1px",
      0: "0",
      1: "4px",
      2: "8px",
      3: "12px",
      4: "16px",
      5: "20px",
      6: "24px",
      8: "32px",
      10: "40px",
      12: "48px",
      16: "64px",
      20: "80px",
      24: "96px",
      32: "128px",
      40: "160px",
      48: "192px",
      56: "224px",
      64: "256px",
    },
    extend: {
      zIndex: {
        max: "2147400000", //2147483647
      },
      keyframes: {
        "text-bounce": {
          "25%": { transform: "scale(1.02)" },
          "50%": { transform: "scale(1)" },
          "75%": { transform: "scale(1.02)" },
        },
        "border-blink": {
          "0%": { boxShadow: "0 0 0 1px #ffa600" },
          "25%": { boxShadow: "0 0 0 1px #f9f9f9" },
          "50%": { boxShadow: "0 0 0 1px #ffa600" },
          "75%": { boxShadow: "0 0 0 1px #f9f9f9" },
          "100%": { boxShadow: "0 0 0 1px #ffa600" },
        },
        "bounce-once": {
          "0%": { transform: "scale(0.3) translate3d(0,0,0)" },
          "50%": { transform: "scale(1.1)" },
          "75%": { transform: "scale(0.9)" },
          "100%": { transform: "scale(1)" },
        },
      },
      animation: {
        "text-bounce": "text-bounce 0.4s linear 1",
        "border-blink": "border-blink 2s linear infinite",
        "bounce-once": "bounce-once 0.3s linear 1",
      },
    },
  },
  safelist: ["scale-100", "animate-bounce-once", "animate-text-bounce"],
  plugins: [
    function ({ addUtilities }) {
      addUtilities(
        {
          ".scrollbar-invisible": {
            "-ms-overflow-style": "none",
            "scrollbar-width": "none",
            "&::-webkit-scrollbar": {
              display: "none",
            },
          },
        },
        ["responsive", "hover"]
      );
    },
    function ({ addVariant, e }) {
      addVariant("mono", ({ modifySelectors, separator }) => {
        modifySelectors(({ className }) => {
          return `.mono .${e(`mono${separator}${className}`)}`;
        });
      });
    },
  ],
};
