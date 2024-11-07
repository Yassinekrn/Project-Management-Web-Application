/** @type {import('tailwindcss').Config} */
module.exports = {
    content: ["./views/**/*.ejs"],
    theme: {
        extend: {
            colors: {
                primary: "#4F46E5", // Indigo
                secondary: "#10B981", // Emerald
                accent: "#F59E0B", // Amber
                background: "#F3F4F6", // Light Gray
                text: "#111827", // Dark Gray
            },
        },
    },
    plugins: [],
};
