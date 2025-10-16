# 🧩 React + Vite + Zustand + TanStack Router

## Overview

This project demonstrates a scalable and maintainable React architecture combining **Vite**, **Zustand**, and **TanStack Router** for fast routing and state management. It implements a **To-Do App with Theme Switching**, showing enterprise-level design principles such as modularity, persistence, and reactive UI updates.


[View Website](https://taddaaaaaa.netlify.app)
---

## 🚀 Tech Stack

| Technology             | Purpose                                                         |
| ---------------------- | --------------------------------------------------------------- |
| **React (TypeScript)** | Component-based UI                                              |
| **Vite**               | Ultra-fast build tool for modern development                    |
| **Zustand**            | Lightweight global state management with slices and persistence |
| **TanStack Router**    | Type-safe, file-based routing system                            |
| **CSS Variables**      | Theme tokens for light/dark mode and global design consistency  |

---

## 🧠 Core Features

### ✅ Global State with Zustand

* Centralized store managing **Todos** and **Theme**.
* Instant updates across pages — no prop drilling.
* Data persistence via localStorage using Zustand's `persist` middleware.
* Supports future expansion into multiple slices (`themeStore`, `todoStore`, etc.).

### 🎨 Theme System (CSS Variables)

* Two theme modes: **Light** and **Dark**.
* Defined in `/src/styles/variables.css` using tokens like `--primary-100`, `--secondary-100`, etc.
* Dynamically toggled via Zustand and applied to `<body>` for instant theme switching.

### 🗂️ Modular Routing

* Built with **TanStack Router** for modern, file-based routing.
* Each route (`/`, `/tasks`, `/game`) is a self-contained module.
* Demonstrates global reactivity across routes.

### 🧾 To-Do CRUD Operations

* Add, edit, toggle, delete, and clear tasks.
* Real-time synchronization across pages.
* Fully reactive and persistent across reloads.

---

## 📁 Folder Structure

```bash
src/
 ├─ main.tsx              # App entry point
 ├─ store/
 │   └─ appStore.ts       # Global Zustand store (theme + todos)
 ├─ routes/
 │   ├─ __root.tsx        # Root layout with Navbar
 │   ├─ index.tsx         # Add To-Do page
 │   ├─ tasks.tsx         # To-Do list CRUD page
 │   └─ game.tsx          # Game page
 ├─ components/
 │   └─ Navbar.tsx        # Navigation bar with theme toggle
 ├─ styles/
 │   ├─ variables.css     # Light/Dark theme tokens
 │   └─ index.css         # Global styles importing variables
```

---

## 🧱 Key Concepts Illustrated

* **Zustand Subscriptions:** Components only re-render for the slice of state they use.
* **Persistence:** State automatically saved and restored via middleware.
* **Reactive Theming:** CSS variables respond instantly to store updates.
* **Scalability:** Ready for splitting into domain-based slices.

---

## ⚙️ How to Run

```bash
# 1. Clone repo
$ git clone <repo-url>

# 2. Install dependencies
$ npm install

# 3. Start development server
$ npm run dev

# 4. Visit the app
http://localhost:5173
```

---

## 🔮 Enterprise-Ready Extensions

To scale this project into an enterprise-grade system:

* Add **React Query** for async API integration.
* Introduce **logging middleware** for audit trails.
* Implement **design tokens** from JSON and generate CSS variables.
* Add **unit tests** for Zustand slices.
* Integrate **i18n** for multilingual UI.

---

## 💡 Summary

This project exemplifies a clean, performant, and extensible modern React stack:

> ⚡ *Vite* for speed, *Zustand* for simplicity, *TanStack Router* for routing power, and *CSS Variables* for elegant theming.*

It’s not just a To-Do app — it’s a **foundation for enterprise-grade React architecture**.
