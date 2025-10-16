
/**
 * Home Page
 * ----------
 * Allows adding new todos (saved globally in Zustand store).
 */

import { useAppStore } from "@/store/appStore";
import { useState } from "react";


const Home = () => {
  const addTodo = useAppStore((state) => state.addTodo);
  const [text, setText] = useState("");
  
  const handleAdd = () => {
    if (!text.trim()) return;
    addTodo(text);
    setText("");
  };

  return (
    <section>
      <h1>Add Task</h1>
      <div style={{ display: "flex", gap: "0.5rem" }}>
        <input type="text"
          id="task"
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Enter a task..."
        />
        <button className="primary" onClick={handleAdd}>
          Add
        </button>
      </div>
    </section>
  );
};

export default Home;
