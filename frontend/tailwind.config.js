import daisyui from 'daisyui';

/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {},
  },
  plugins: [daisyui],
  daisyui: {
    themes: [
      "light", "dark", "forest", "cupcake", "bumblebee", "emerald", "corporate", 
      "synthwave", "retro", "cyberpunk", "valentine", "halloween", "garden", 
      "aqua", "lofi", "pastel", "fantasy", "wireframe", "black", "luxury",
      {
        dracula: {
          
          "primary": "#89b4fa",
          "secondary": "#94e2d5",
          "accent": "#89dceb",
          "neutral": "#313244",
          "base-100": "#1e1f2e",
          "base-200": "#161724",
          "base-300": "#13141f",
          "base-content": "#cdd6f4",
          "info": "#74c7ec",
          "success": "#a6e3a1",
          "warning": "#f9e2af",
          "error": "#f38ba8",
        },
      },
    ],darkMode: false,
  },
}