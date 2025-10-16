
/**
 * Zustand Global Store
 * --------------------
 * Holds TWO state slices:
 * 1️ Theme management (light/dark)
 * 2️ To-Do management (CRUD operations)
 *
 * Zustand works with plain TypeScript/JavaScript objects.
 * - "set" updates state reactively
 * - "get" reads current state
 * - With "persist" middleware, data is saved to localStorage automatically.
 */


import { create } from "zustand";
import { persist } from "zustand/middleware";

// --- Define the types ---
export interface Todo {
    id: string;
    text: string;
    completed: boolean;
}

interface AppState {
    theme: "light" | "dark";
    toggleTheme: () => void;

    todos: Todo[];
    addTodo: (text: string) => void;
    toggleTodo: (id: string) => void;
    editTodo: (id: string, newText: string) => void;
    deleteTodo: (id: string) => void;
    clearTodos: () => void;
}

// --- Zustand Store ---
export const useAppStore = create<AppState>()(
    persist(
        (set) => ({
            // THEME
            theme: "light",
            toggleTheme: () => (
                set((state) => ({
                    theme: state.theme === "light" ? "dark" : "light",
                }))
            ),

            // TODOS
            todos: [],
            addTodo: (text) => 
                set((state) => ({
                    todos: [
                        ...state.todos,
                        {id: crypto.randomUUID(), text, completed: false},
                    ]
                })),
            toggleTodo: (id) => 
                set((state) => ({
                    todos: state.todos.map((t) =>
                        t.id === id ? {...t, completed: !t.completed} : t 
                    )
                })),
            editTodo: (id, newText) => 
                set((state) => ({
                    todos: state.todos.map((t) => 
                        t.id === id ? {...t, text: newText}: t
                    ),
                })),
            deleteTodo: (id) => 
                set((state) => ({
                    todos: state.todos.filter((t) => t.id !== id),
                })),
            clearTodos: () => set({todos: []}),        
        }),
        {name: "app-storage"} // key for localStorage
    )
)

// (alias) persist<AppState, [], [], AppState>(initializer: StateCreator<AppState, [["zustand/persist", unknown]], []>, options: PersistOptions<AppState, AppState, unknown>): StateCreator<AppState, [], [["zustand/persist", AppState]]>
// import persist