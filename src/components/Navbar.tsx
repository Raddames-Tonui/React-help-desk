
/**
 * Navbar Component
 * ----------------
 * - Uses theme-aware CSS variables
 * - Provides navigation and theme toggle
 */

import { useAppStore } from "@/store/appStore";
import { Link } from "@tanstack/react-router";

export default function Navbar() {
  const theme = useAppStore((state) => state.theme);
  const toggleTheme = useAppStore((state) => state.toggleTheme);

  return (
    <nav>
      <div>
        <img src="/todo.png" alt="todo logo" className="logo" />
        <Link to="/">Forms</Link>
        <Link to="/forms">Select</Link>
        {/* <Link to="/game">Game Zone</Link> */}
      </div>
      <button onClick={toggleTheme} className="secondary">
        Theme: {theme}
      </button>
    </nav>
  );
}