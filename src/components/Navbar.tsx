
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
        <Link to="/">Add Task</Link>
        <Link to="/tasks">All Tasks</Link>
        <Link to="/settings">Settings</Link>
      </div>
      <button onClick={toggleTheme} className="secondary">
        Theme: {theme}
      </button>
    </nav>
  );
}