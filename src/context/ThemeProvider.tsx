import { createContext, useContext, useState } from "react";

type ThemeContextValue = {
    theme,
    setTheme
}
    
const ThemeContext = createContext<ThemeContextValue | undefined>(undefined);

function ThemeProvider({ children }) {
    const [theme, setTheme] = useState('light');

    const value = {
        theme,
        setTheme
    } 
    return (
        <ThemeContext.Provider value={{value}}>
            {children}
        </ThemeContext.Provider>
    );
}

export function useTheme() {
    const context = useContext(ThemeContext);
    if (!context) throw new Error ("useTheme must be used within ThemeProvider");
    return context;
}