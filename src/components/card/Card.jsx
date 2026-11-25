import { Draggable } from '@hello-pangea/dnd'
import React from 'react'

function Card({ card, columnId, deleteCard, index, openEditModal, isDragDisabled }) {
  return (
    <Draggable draggableId={String(card.id)} index={index} isDragDisabled={isDragDisabled}>
      {(provided, snapshot) => (
        <div
          ref={provided.innerRef}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
          className='pt-3'
        >
          <div
            className={`p-3 bg-[var(--surface)] rounded-lg border border-[var(--border)] transition-shadow ${
              snapshot.isDragging ? 'shadow-xl ring-2 ring-blue-500/40' : 'shadow-sm hover:shadow-md'
            }`}
          >
            <h3 className='font-medium text-[var(--text)] break-words'>{card.title}</h3>
            <p className='mt-1 text-sm text-[var(--muted)] whitespace-pre-wrap break-words'>
              {card.description}
            </p>

            <div className='mt-3 flex justify-between items-center'>
              <span className='text-xs text-[var(--muted)]'>{card.date}</span>

              <span className='flex gap-1'>
                <button
                  onClick={() => openEditModal(columnId, card)}
                  aria-label='Edit card'
                  title='Edit card'
                  className='p-1.5 rounded-md hover:bg-[var(--hover)] transition'
                >
                  <svg
                    xmlns='http://www.w3.org/2000/svg'
                    width='18'
                    height='18'
                    viewBox='0 0 24 24'
                    fill='none'
                    stroke='#3B82F6'
                    strokeWidth='2'
                    strokeLinecap='round'
                    strokeLinejoin='round'
                  >
                    <path d='M12 20h9' />
                    <path d='M16.5 3.5a2.12 2.12 0 0 1 3 3L8 18l-4 1 1-4Z' />
                  </svg>
                </button>

                <button
                  onClick={() => deleteCard(columnId, card.id)}
                  aria-label='Delete card'
                  title='Delete card'
                  className='p-1.5 rounded-md hover:bg-red-500/10 transition'
                >
                  <svg
                    xmlns='http://www.w3.org/2000/svg'
                    width='18'
                    height='18'
                    viewBox='0 0 24 24'
                    fill='none'
                    stroke='red'
                    opacity='0.8'
                    strokeWidth='2'
                    strokeLinecap='round'
                    strokeLinejoin='round'
                  >
                    <path d='M3 6h18' />
                    <path d='M8 6V4h8v2' />
                    <path d='M19 6l-1 14H6L5 6' />
                    <path d='M10 11v6' />
                    <path d='M14 11v6' />
                  </svg>
                </button>
              </span>
            </div>
          </div>
        </div>
      )}
    </Draggable>
  )
}

export default Card