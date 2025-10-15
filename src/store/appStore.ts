/**
 * Zustand Theme Store
 * -------------------
 * A simple, reactive global store that holds the current theme.
 * Zustand uses plain JavaScript/TypeScript under the hood — no reducers or context needed.
 *
 * `persist` middleware automatically saves to localStorage so your theme
 * survives page reloads.
 */

import { create } from "zustand";
import { persist } from "zustand/middleware";

export interface Todo {
    id: string;
    text: string;
    completed: boolean;
}

interface AppState {
    // Theme Slice
    theme: "light" | "dark";
    toggleTheme: () => void;

    // TODO slice
    todos: Todo[];
    addTodo: (text: string) => void;
    toggleTodo: (id: string) => void;
    deleteTodo: (id: string) => void;
    editTodo: (id: string, newText: string) => void;
    clearTodos: () => void;
}

// --- Zustand store ---
export const useAppStore = create<AppState>()(
    persist(
        (set, get) => ({

            // THEME
            theme: "light",
            toggleTheme: () => (
                set((state) => ({
                    theme: state.theme === "light" ? "dark" : "light"
                }))
            ),

            // TODOS
            todos: [],
            addTodo: (text) => (
                set((state) => ({
                    todos: [...state.todos,
                        {id: crypto.randomUUID(), text, completed: false},
                    ]
                }))
            ),
            toggleTodo: (id) => (
                set((state) => ({
                    todos: state.todos.map((t) => t.id === id ? {...t, completed: !t.completed} : t),
                }))
            ),

            deleteTodo: (id) => (
                set((state) => ({
                    todos: state.todos.filter((t) => t.id !==id),
                }))
            ),
            editTodo: (id, newText) => (
                set((state) => ({
                    todos: state.todos.map((t) =>  t.id === id ? {...t, text: newText}: t)
                }))
            ),

            clearTodos: () => set({todos: []}),
        }),
        { name: "app-storage" } // key for localStorage
    )
)

