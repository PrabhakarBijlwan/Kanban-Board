import React, { useState } from 'react'
import { Droppable, Draggable } from '@hello-pangea/dnd'
import Card from '../card/Card'

function Column({
  title,
  cards,
  totalCards,
  id,
  index,
  isSearching,
  deleteCard,
  openAddModal,
  openEditModal,
  renameColumn,
  deleteColumn,
}) {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isRenaming, setIsRenaming] = useState(false)
  const [newName, setNewName] = useState(title)

  const handleRename = () => {
    if (newName.trim()) renameColumn(id, newName.trim())
    else setNewName(title)
    setIsRenaming(false)
  }

  const handleDelete = () => {
    setIsMenuOpen(false)
    if (window.confirm(`Delete "${title}" and its ${totalCards} card(s)?`)) {
      deleteColumn(id)
    }
  }

  return (
    <Draggable draggableId={`column-${id}`} index={index} isDragDisabled={isSearching}>
      {(dragProvided, dragSnapshot) => (
        <div
          ref={dragProvided.innerRef}
          {...dragProvided.draggableProps}
          className={`w-[85vw] max-w-xs sm:w-72 shrink-0 px-4 sm:px-6 py-4 bg-[var(--col)] rounded-xl ${
            dragSnapshot.isDragging ? 'shadow-2xl ring-2 ring-blue-500/40' : ''
          }`}
        >
          <div
            {...dragProvided.dragHandleProps}
            className={`relative flex justify-between items-center ${
              isSearching ? '' : 'cursor-grab'
            }`}
          >
            {isRenaming ? (
              <input
                autoFocus
                value={newName}
                onChange={(e) => setNewName(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') handleRename()
                  if (e.key === 'Escape') {
                    setNewName(title)
                    setIsRenaming(false)
                  }
                }}
                className='w-40 px-2 py-1 text-[var(--text)] bg-[var(--surface)] border border-blue-400 rounded-md outline-none font-semibold'
              />
            ) : (
              <div className='flex items-center'>
                <span className='font-semibold text-[var(--text)]'>{title}</span>
                <span className='ml-2 px-2 py-0.5 text-xs rounded-full bg-[var(--surface)] text-[var(--muted)]'>
                  {cards.length}
                </span>
              </div>
            )}

            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              aria-label='Column options'
              className='px-2 rounded-md text-[var(--muted)] hover:bg-[var(--hover)] transition'
            >
              ...
            </button>

            {isMenuOpen && (
              <div className='absolute right-0 top-8 z-10 w-32 bg-[var(--surface)] border border-[var(--border)] rounded-lg shadow-lg text-sm overflow-hidden'>
                <button
                  onClick={() => {
                    setIsMenuOpen(false)
                    setNewName(title)
                    setIsRenaming(true)
                  }}
                  className='block w-full text-left px-3 py-2 text-[var(--text)] hover:bg-[var(--hover)]'
                >
                  Rename
                </button>
                <button
                  onClick={handleDelete}
                  className='block w-full text-left px-3 py-2 text-red-500 hover:bg-[var(--hover)]'
                >
                  Delete
                </button>
              </div>
            )}
          </div>

          <Droppable droppableId={String(id)} type='CARD' isDropDisabled={isSearching}>
            {(provided, snapshot) => (
              <div
                ref={provided.innerRef}
                {...provided.droppableProps}
                className={`mt-2 rounded-lg transition-colors ${
                  snapshot.isDraggingOver ? 'bg-[var(--hover)]' : ''
                }`}
              >
                {cards.length === 0 && !snapshot.isDraggingOver && (
                  <div className='mt-3 h-16 flex items-center justify-center border border-dashed border-[var(--border)] rounded-lg text-sm text-[var(--muted)]'>
                    {isSearching ? 'No matching cards' : 'Drop here'}
                  </div>
                )}

                {cards.map((card, cardIndex) => (
                  <Card
                    key={card.id}
                    card={card}
                    index={cardIndex}
                    columnId={id}
                    deleteCard={deleteCard}
                    openEditModal={openEditModal}
                    isDragDisabled={isSearching}
                  />
                ))}
                {provided.placeholder}
              </div>
            )}
          </Droppable>

          <button
            onClick={() => openAddModal(id)}
            className='mt-3 w-full text-left px-2 py-2 text-sm text-[var(--muted)] rounded-lg hover:bg-[var(--hover)] hover:text-[var(--text)] transition'
          >
            + Add card
          </button>
        </div>
      )}
    </Draggable>
  )
}

export default Column