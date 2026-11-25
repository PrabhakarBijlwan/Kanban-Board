import Navbar from './components/navbar/Navbar'
import Column from './components/column/Column'
import { useState, useEffect } from 'react'
import { nanoid } from 'nanoid'
import { DragDropContext, Droppable } from '@hello-pangea/dnd'
import CardModal from './components/cardmodal/CardModal'

const initialColumns = [
  {
    id: 1,
    title: 'To Do',
    cards: [
      { id: nanoid(), title: 'Demo heading1 ', description: 'learn react', date: '12 Nov 2026' },
      { id: nanoid(), title: 'Demo heading2', description: 'Solve 3 problems', date: '13 Nov 2026' },
    ],
  },
  { id: 2, title: 'In Progress', cards: [] },
  { id: 3, title: 'Done', cards: [] },
]

function App() {
  const today = new Date()
  const todayDate = today.toDateString()

  const [modal, setModal] = useState(null)
  const [isAddingColumn, setIsAddingColumn] = useState(false)
  const [newColumnTitle, setNewColumnTitle] = useState('')

  // ---- new: search and dark mode ----
  const [search, setSearch] = useState('')
  const [dark, setDark] = useState(() => {
    const saved = localStorage.getItem('theme')
    if (saved) return saved === 'dark'
    return window.matchMedia('(prefers-color-scheme: dark)').matches
  })

  useEffect(() => {
    document.documentElement.classList.toggle('dark', dark)
    localStorage.setItem('theme', dark ? 'dark' : 'light')
  }, [dark])

  const toggleDark = () => setDark(!dark)

  const [columns, setColumns] = useState(() => {
    const savedColumns = localStorage.getItem('columns')
    return savedColumns ? JSON.parse(savedColumns) : initialColumns
  })

  useEffect(() => {
    localStorage.setItem('columns', JSON.stringify(columns))
  }, [columns])

  // ---- modal ----
  const openAddModal = (columnId) => setModal({ mode: 'add', columnId })
  const openEditModal = (columnId, card) => setModal({ mode: 'edit', columnId, card })

  const handleModalSave = (title, description) => {
    if (modal.mode === 'add') {
      addCard(modal.columnId, title, description)
    } else {
      editCard(modal.columnId, title, description, modal.card.id)
    }
    setModal(null)
  }

  // ---- cards ----
  const addCard = (columnId, title, description) => {
    setColumns(
      columns.map((column) =>
        column.id === columnId
          ? {
              ...column,
              cards: [
                ...column.cards,
                { id: nanoid(), title: title, description: description, date: todayDate },
              ],
            }
          : column
      )
    )
  }

  const deleteCard = (columnId, cardId) => {
    setColumns(
      columns.map((column) =>
        column.id === columnId
          ? { ...column, cards: column.cards.filter((card) => card.id !== cardId) }
          : column
      )
    )
  }

  const editCard = (columnId, newtitle, newdescription, cardId) => {
    setColumns(
      columns.map((column) =>
        column.id === columnId
          ? {
              ...column,
              cards: column.cards.map((card) =>
                card.id === cardId
                  ? { ...card, title: newtitle, description: newdescription }
                  : card
              ),
            }
          : column
      )
    )
  }

  // ---- drag and drop ----
  const onDragEnd = (result) => {
    const { source: src, destination: dest, type } = result

    if (!dest) return

    if (type === 'COLUMN') {
      if (src.index === dest.index) return
      const copyColumns = [...columns]
      const [movedColumn] = copyColumns.splice(src.index, 1)
      copyColumns.splice(dest.index, 0, movedColumn)
      setColumns(copyColumns)
      return
    }

    if (src.droppableId === dest.droppableId && src.index === dest.index) return

    const srcCol = columns.find((column) => String(column.id) === src.droppableId)
    const destCol = columns.find((column) => String(column.id) === dest.droppableId)

    const copySrcColCards = [...srcCol.cards]
    const [movedCard] = copySrcColCards.splice(src.index, 1)

    if (srcCol === destCol) {
      copySrcColCards.splice(dest.index, 0, movedCard)
      setColumns(
        columns.map((column) =>
          column === srcCol ? { ...column, cards: copySrcColCards } : column
        )
      )
    } else {
      const copyDestColCards = [...destCol.cards]
      copyDestColCards.splice(dest.index, 0, movedCard)

      setColumns(
        columns.map((column) => {
          if (column === srcCol) {
            return { ...column, cards: copySrcColCards }
          } else if (column === destCol) {
            return { ...column, cards: copyDestColCards }
          } else {
            return column
          }
        })
      )
    }
  }

  // ---- columns ----
  const addColumn = () => {
    if (!newColumnTitle.trim()) return
    setColumns([...columns, { id: nanoid(), title: newColumnTitle.trim(), cards: [] }])
    setNewColumnTitle('')
    setIsAddingColumn(false)
  }

  const renameColumn = (columnId, newTitle) => {
    setColumns(
      columns.map((column) =>
        column.id === columnId ? { ...column, title: newTitle } : column
      )
    )
  }

  const deleteColumn = (columnId) => {
    setColumns(columns.filter((column) => column.id !== columnId))
  }

  // ---- new: filtered view for search (does not change saved data) ----
  const query = search.trim().toLowerCase()
  const isSearching = query !== ''

  const visibleColumns = columns.map((column) => ({
    ...column,
    cards: isSearching
      ? column.cards.filter(
          (card) =>
            card.title.toLowerCase().includes(query) ||
            (card.description || '').toLowerCase().includes(query)
        )
      : column.cards,
  }))

  const hasNoMatches =
    isSearching && visibleColumns.every((column) => column.cards.length === 0)

  return (
    <>
      <Navbar search={search} setSearch={setSearch} dark={dark} toggleDark={toggleDark} />

      {isSearching && (
        <p className='mx-4 md:mx-6 mt-4 text-sm text-[var(--muted)]'>
          {hasNoMatches
            ? `No cards match "${search.trim()}". Dragging is turned off while searching.`
            : 'Dragging is turned off while searching. Clear the search to move cards.'}
        </p>
      )}

      <DragDropContext onDragEnd={onDragEnd}>
        <Droppable droppableId='board' direction='horizontal' type='COLUMN'>
          {(provided) => (
            <div
              ref={provided.innerRef}
              {...provided.droppableProps}
              className='mx-4 md:mx-6 my-4 md:my-6 flex gap-4 overflow-x-auto items-start pb-4'
            >
              {visibleColumns.map((column, index) => (
                <Column
                  key={column.id}
                  id={column.id}
                  index={index}
                  title={column.title}
                  cards={column.cards}
                  totalCards={columns[index].cards.length}
                  isSearching={isSearching}
                  deleteCard={deleteCard}
                  openAddModal={openAddModal}
                  openEditModal={openEditModal}
                  renameColumn={renameColumn}
                  deleteColumn={deleteColumn}
                />
              ))}
              {provided.placeholder}

              <div className='w-[85vw] max-w-xs sm:w-72 shrink-0'>
                {isAddingColumn ? (
                  <div className='p-3 bg-[var(--col)] rounded-xl'>
                    <input
                      autoFocus
                      type='text'
                      placeholder='Column name'
                      value={newColumnTitle}
                      onChange={(e) => setNewColumnTitle(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') addColumn()
                        if (e.key === 'Escape') setIsAddingColumn(false)
                      }}
                      className='w-full mb-2 px-3 py-2 text-[var(--text)] bg-[var(--surface)] border border-[var(--border)] rounded-lg outline-none placeholder:text-[var(--muted)] focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20'
                    />
                    <div className='flex gap-2'>
                      <button
                        onClick={addColumn}
                        className='px-3 py-1.5 bg-blue-600 text-white rounded-lg text-sm hover:bg-blue-700 transition'
                      >
                        Add column
                      </button>
                      <button
                        onClick={() => {
                          setIsAddingColumn(false)
                          setNewColumnTitle('')
                        }}
                        className='px-3 py-1.5 text-[var(--text)] border border-[var(--border)] rounded-lg text-sm hover:bg-[var(--hover)] transition'
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                ) : (
                  <button
                    onClick={() => setIsAddingColumn(true)}
                    className='w-full px-4 py-3 text-sm text-[var(--muted)] border border-dashed border-[var(--border)] rounded-xl hover:bg-[var(--hover)] hover:text-[var(--text)] transition'
                  >
                    + Add column
                  </button>
                )}
              </div>
            </div>
          )}
        </Droppable>
      </DragDropContext>

      {modal && (
        <CardModal
          mode={modal.mode}
          initialTitle={modal.card ? modal.card.title : ''}
          initialDescription={modal.card ? modal.card.description : ''}
          onSave={handleModalSave}
          onClose={() => setModal(null)}
        />
      )}
    </>
  )
}

export default App