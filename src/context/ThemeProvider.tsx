import { createContext,useState } from "react";


interface ThemeContextType {
    theme: "light" | "dark";
    toggleTheme: () => void;
    isSidebarOpen: boolean;
    toggleSidebar: () => void;
}
const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
    const [theme, setTheme] = useState<"light" | "dark">(
        () => (localStorage.getItem("theme") as "light" | "dark") || "light"
    )
    const [isSidebaOpen, setSidebarOpen] = useState<boolean>(() => (
        (localStorage.getItem("isSidebarOpen") === "true")
    ))


    const toggleTheme = () => {
        const newTheme = theme === "light" ? "dark" : "light";
        setTheme(newTheme);
        localStorage.setItem("theme", newTheme);
    };

    const toggleSidebar = () => {
        const newState = !isSidebaOpen;
        localStorage.setItem("isSidebarOpen", newState.toString());
        setSidebarOpen(newState);
    }

    const values = {
        theme,
        toggleTheme,
        isSidebarOpen: isSidebaOpen,
        toggleSidebar
    }

    return <ThemeContext.Provider value={values}>{children}</ThemeContext.Provider>;
}