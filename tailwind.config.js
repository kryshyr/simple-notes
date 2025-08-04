/** @type {import('tailwindcss').Config} */
module.exports = {
  // NOTE: Update this to include the paths to all files that contain Nativewind classes.
  content: ["./app/**/*.{js,jsx,ts,tsx}", "./components/**/*.{js,jsx,ts,tsx}"],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
        //colors
        colors: {
            primary: '#4F46E5',
            secondary: '#6366F1',
            accent: '#818CF8',
            background: '#F3F4F6',
            text: '#111827',
        },
    },
  },
  plugins: [],
}