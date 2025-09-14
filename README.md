# React Skill Tree

A visual skill-tree builder using **React** and **React Flow**.  
Add skills, connect prerequisites, unlock nodes, and save your progress to `localStorage`.

---

## Setup & Run

```bash
# 1. Clone the repository
git clone https://github.com/harshada2727/react-skill-tree.git
cd skill_tree

# 2. Install dependencies
npm install

# 3. Start development server
npm start

# 4. Lint & format and Test (optional)
npm test
npm run lint
npm run format
```

## Features

- Add / Edit Skills: name, description, cost, and level.

- Connect Skills: drag to create prerequisite edges.

- Cycle Prevention: checks for circular dependencies.

- Unlock Logic: unlock only when all prerequisites are met.

- Persistent Storage: automatically saves to localStorage.

- Search & Highlight: find skills and related neighbors.

## Tech stack

React: UI library

React Flow: interactive graph visualization

React Toastify: notifications

nanoid: unique IDs

Jest: testing framework

ESLint + Prettier: code quality and consistent formatting

## Completed Bonuses

- **Cycle Prevention** : When you try to connect nodes in a way that would create a circular dependency, the app blocks the connection and shows a toast notification using React Toastify.

- **Search & Path Highlight** : Real-time search filters nodes by name and highlights the matching nodes along with their connected path.

## AI Assistance Disclosure

Portions of this project were created or refined with the help of Windsurf AI, specifically:

- BFS & DFS algorithms (search highlighting and cycle detection)

- Initial boilerplate setup, test setup (React app scaffolding and configuration)

- Unit test scaffolding/examples using Jest

## Additional features

- **Clear Storage** : one-click button to remove saved data from `localStorage`.
- **Optimized BFS Search** : faster graph traversal for search highlighting.
- **Toast Messages** : consistent user feedback for all key actions (add node, unlock, errors).
- **Input Validation** : ensures validation for required fields (name, description).

## Scope of Improvements

- Export/Import & Versioning
  Allow users to back up or share skill trees as JSON and restore previous versions with an undo/redo history.

- Dark/Light Mode
  A toggle for theme switching to improve readability and user preference support.

- Optimized Search & Performance
  Memoized breadth-first search for highlighting to handle very large graphs efficiently.
