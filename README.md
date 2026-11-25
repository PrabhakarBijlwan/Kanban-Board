# Taskboard

A Kanban-style task board built with React. Organize work into columns, drag cards between them, search across all cards, and switch between light and dark mode. Everything is saved in the browser, so your board is still there after a refresh.

**Live demo:** [add your Vercel or Netlify link here]

![Taskboard screenshot](./screenshots/board.png)

## Features

**Cards**
- Add, edit and delete cards through a shared modal
- Drag and drop cards within a column or between columns, including into empty columns
- Each card stores a title, a description and the date it was created

**Columns**
- Add new columns, rename them and delete them (deleting a column also deletes its cards, after a confirmation)
- Drag columns to reorder them

**Search and theme**
- Search cards by title or description as you type, without changing the saved data
- Light and dark mode, remembered between visits (it follows the device setting on the first visit)

**Other**
- Board data is saved in `localStorage`
- Responsive layout: columns sit side by side on laptops, and on phones each column fills most of the screen and the board scrolls sideways

## Tech stack

- [React](https://react.dev/) with [Vite](https://vite.dev/)
- [Tailwind CSS](https://tailwindcss.com/) for styling, with CSS variables for the light and dark themes
- [@hello-pangea/dnd](https://github.com/hello-pangea/dnd) for drag and drop
- [nanoid](https://github.com/ai/nanoid) for unique card and column ids

## Getting started

You need Node.js 18 or newer.

```bash
# clone the repository
git clone https://github.com/<your-username>/kanban-Board.git
cd kanban-Board

# install dependencies
npm install

# start the dev server
npm run dev
```

Open the local address printed in the terminal (usually `http://localhost:5173`).

To create a production build:

```bash
npm run build
npm run preview
```

## Project structure

```
src/
  App.jsx                  # board state, drag and drop logic, search and theme
  index.css                # Tailwind setup and theme variables
  components/
    navbar/Navbar.jsx      # logo, search box and dark mode toggle
    column/Column.jsx      # one column: header menu, card list, add card button
    card/Card.jsx          # one draggable card
    cardmodal/CardModal.jsx  # popup form used for both adding and editing cards
```

## How it works

- All board data lives in one `columns` state in `App.jsx`. Each column holds its own array of cards.
- A `useEffect` writes the state to `localStorage` on every change, and the state is read back from it on the first load.
- Column and card drags share one `onDragEnd` handler, which tells them apart by the drag `type` and updates the state with immutable copies.
- Search builds a filtered copy of the columns for display only. The stored data is never modified, so clearing the search restores the full board.

## Notes

- Dragging is turned off while a search is active, because the filtered list and the stored list have different positions.
- There is no backend. Data stays in the browser it was created in, so it is not shared between devices.

## Possible improvements

- A backend with user accounts and a database, so boards sync across devices (MERN)
- Labels, priorities and due dates on cards
- Multiple boards with a board switcher
- Undo for deleted cards and columns

## Author

Prabhakar Bijlwan
[GitHub](https://github.com/PrabhakarBijlwan) · [Email](mailto:prabhakarbijlwan09@gmail.com)