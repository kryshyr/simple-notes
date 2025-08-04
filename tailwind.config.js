/** @type {import('tailwindcss').Config} */
module.exports = {
  // NOTE: Update this to include the paths to all files that contain Nativewind classes.
  content: ["./app/**/*.{js,jsx,ts,tsx}", "./components/**/*.{js,jsx,ts,tsx}"],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
        //colors
        colors: {
            primary: '#231942',
            secondary: '#5e548e',
            accent: '#818CF8',
            background: '#F3F4F6',
            text: '#111827',
            error: {
                dark: '#ffccd5',
                light: '#fff0f3',
            },
            gray: {
                dark: '#e9ecef',
                light: '#f8f9fa',
            }
        },
    },
  },
  plugins: [],
}