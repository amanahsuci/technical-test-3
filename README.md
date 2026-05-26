# My Todo List — React Refactoring

A simple Todo List application built with React. This project was refactored to address security vulnerabilities, performance issues, code quality improvements, and accessibility enhancements.

---

## Tech Stack

- **React** 18
- **Vite** (build tool)
- **pnpm** (package manager)
- **Vitest** (testing)

---

## Getting Started

### Prerequisites

- Node.js v22+
- pnpm (latest version)

Install pnpm if you don't have it:

```bash
npm install -g pnpm
```

### Clone the Repository

```bash
git clone <repository-url>
cd <repository-name>
```

### Install Dependencies

```bash
pnpm install
```

### Environment Variables

Create a `.env` file in the root of the project:

```bash
cp .env.example .env
```

Then fill in the required values:

```env
VITE_API_KEY=your_api_key_here
```

> **Note:** Never commit the `.env` file to version control. It is already listed in `.gitignore`.

### Run Development Server

```bash
pnpm dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

### Run Tests

```bash
pnpm test
```

---

## Features

- Add new todos
- Mark todos as completed
- Delete todos
- Filter todos by: All, Active, Completed
- Persistent storage via `localStorage`
- Empty state message when no todos are found

---

## Refactoring Summary

This project was audited and refactored to fix **13 issues** across 5 categories.

### 🔴 Security

| Issue | Problem | Fix |
|---|---|---|
| Issue 1 | API key hardcoded in source code | Moved to `.env` using `import.meta.env.VITE_API_KEY` |
| Issue 15 | XSS vulnerability via `dangerouslySetInnerHTML` | Replaced with safe `{todo.text}` text rendering |
| Issue 16 | Debug `console.log` exposing API key in production | Removed all debug statements from JSX |

### 🟠 Performance

| Issue | Problem | Fix |
|---|---|---|
| Issue 4 | `useEffect` running on every render | Added `[todos]` dependency array |
| Issue 8 & 9 | `filteredTodos` and `stats` recalculated on every render | Wrapped with `useMemo` |
| Issue 5 | `addTodo` function recreated on every render | Wrapped with `useCallback` |
| Issue 10 | Inline arrow functions in JSX recreated on every render | Extracted to named `useCallback` handlers |

### 🟡 Code Quality

| Issue | Problem | Fix |
|---|---|---|
| Issue 3 | `JSON.parse` without error handling | Wrapped with `try/catch`, clears corrupted data |
| Issue 6 | `Date.now()` as ID — risk of collision | Replaced with `crypto.randomUUID()` |
| Issue 7 | No error handling in `deleteTodo` and `toggleTodo` | Added validation for missing or invalid `id` |
| Issue 13 | No empty state when list is empty | Added contextual empty state message |

### 🔵 Accessibility & Developer Experience

| Issue | Problem | Fix |
|---|---|---|
| Issue 11 | Input field had no label for screen readers | Added `<label>`, `htmlFor`, and `aria-label` |
| Issue 12 | Inline styles inconsistent with CSS file | Moved all styles to `index.css` using proper class names |

---

## Project Structure

```
src/
├── App.jsx        # Main application component
├── index.css      # Global styles
└── main.jsx       # Application entry point
```

---

```
<type>(<scope>): <description>
```

| Type | Usage |
|---|---|
| `fix` | Bug fix or security patch |
| `perf` | Performance improvement |
| `feat` | New feature |
