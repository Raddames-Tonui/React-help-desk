
/**
 * Home Page
 * ----------
 * Allows adding new todos (saved globally in Zustand store).
 */

import { useAppStore } from "@/store/appStore";
import { useState } from "react";

const Home = () => {
 const addTodo = useAppStore((s) => s.addTodo);
  const [text, setText] = useState("");

  const handleAdd = () => {
    if (!text.trim()) return;
    addTodo(text);
    setText("");
  };

  return (
    <div>
      <h1>Add Task</h1>
      <div style={{ display: "flex", gap: "0.5rem" }}>
        <input
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Enter a task..."
        />
        <button className="primary" onClick={handleAdd}>
          Add
        </button>
      </div>
    </div>
  );
};

export default Home;