/**
 * Tasks Page
 * -----------
 * Displays, edits, toggles, and deletes todos.
 * All reactive and synced across pages.
 */

import { useAppStore } from "@/store/appStore";
import { Link } from "@tanstack/react-router";
import { useState } from "react";
import { useShallow } from "zustand/react/shallow";


const Tasks = () => {
    const { todos, toggleTodo, deleteTodo, editTodo, clearTodos } = useAppStore(
        useShallow((state) => ({
            todos: state.todos,
            toggleTodo: state.toggleTodo,
            editTodo: state.editTodo,
            deleteTodo: state.deleteTodo,
            clearTodos: state.clearTodos,
        }))
    );

    const [editing, setEditing] = useState<string | null>(null);
    const [text, setText] = useState("");

    return (
        <section>
            <h1>All Tasks</h1>
            {todos.length === 0 ? (
                <p>No Tasks Yet. <Link to="/">Add Some</Link></p>
            ) : (
                <ul>
                    {todos.map((t) => (
                        <li
                            key={t.id}
                            style={{
                                border: "1px solid var(--border-color)",
                                padding: "0.5rem",
                                marginBottom: "0.5rem",
                                borderRadius: "5px",
                                background: "var(--secondary-100)",
                                display: "flex",
                                justifyContent: "space-between",
                                alignItems: "center",
                            }}
                        >{editing === t.id ? (
                            <input id="editInput"
                                type="text"
                                value={text}
                                onChange={e => setText(e.target.value)}
                                style={{ flex: 1, marginRight: "0.5rem" }}
                            />
                        ) : (
                            <span
                                style={{
                                    textDecoration: t.completed ? "line-through" : "none",
                                    cursor: "pointer",
                                    flex: 1,
                                }}
                                onClick={() => toggleTodo(t.id)}
                            >
                                {t.text}
                            </span>
                        )}
                            <div style={{ display: "flex", gap: "0.3rem" }}>
                                {editing === t.id ? (
                                    <button className="primary"
                                        onClick={() => {
                                            editTodo(t.id, text)
                                            setEditing(null);
                                        }}
                                    >Save</button>
                                ) : (
                                    <button className="secodary"
                                        onClick={() => deleteTodo(t.id)}
                                    >Delete</button>
                                )}
                            </div>
                        </li>
                    ))}
                </ul>
            )}

            {todos.length > 0 && (
                <button
                    onClick={clearTodos}
                    className="seconary"
                    style={{ marginTop: "1rem" }}
                >
                    Clear All
                </button>
            )}

        </section>
    );
};

export default Tasks;