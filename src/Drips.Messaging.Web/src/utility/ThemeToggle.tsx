 
import { useEffect, useState } from "react";

export default function ThemeToggle() {
    const [theme, setTheme] = useState(
        localStorage.getItem("theme") || "light"
    );

    useEffect(() => {
        document.documentElement.setAttribute("data-theme", theme);
        localStorage.setItem("theme", theme);
    }, [theme]);

    return (
        <button onClick={() => setTheme(theme === "light" ? "dark" : "light")}>
            {theme === "light" ? "Switch to Dark" : "Switch to Light"}
        </button>
    );
}
