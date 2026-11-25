import { useState, useEffect } from 'react'

function CardModal({ mode, initialTitle = '', initialDescription = '', onSave, onClose }) {
  const [title, setTitle] = useState(initialTitle)
  const [description, setDescription] = useState(initialDescription)

  useEffect(() => {
    const handleKey = (e) => {
      if (e.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', handleKey)
    return () => window.removeEventListener('keydown', handleKey)
  }, [onClose])

  const handleSave = () => {
    if (!title.trim()) return
    onSave(title, description)
  }

  return (
    <div
      className='fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm px-4'
      onClick={onClose}
    >
      <div
        className='w-full max-w-md bg-[var(--surface)] border border-[var(--border)] rounded-2xl shadow-2xl p-5 sm:p-6'
        onClick={(e) => e.stopPropagation()}
      >
        <div className='flex items-center justify-between mb-5'>
          <h2 className='text-xl font-semibold text-[var(--text)]'>
            {mode === 'add' ? 'Add new card' : 'Edit card'}
          </h2>
          <button
            onClick={onClose}
            aria-label='Close'
            className='w-8 h-8 flex items-center justify-center rounded-full text-[var(--muted)] hover:bg-[var(--hover)] transition'
          >
            ✕
          </button>
        </div>

        <label className='block text-sm font-medium text-[var(--muted)] mb-1'>Title</label>
        <input
          type='text'
          autoFocus
          placeholder='e.g. Finish the login page'
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className='w-full mb-4 px-3 py-2 text-[var(--text)] bg-[var(--bg)] border border-[var(--border)] rounded-lg outline-none placeholder:text-[var(--muted)] focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition'
        />

        <label className='block text-sm font-medium text-[var(--muted)] mb-1'>Description</label>
        <textarea
          placeholder='Add some details...'
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          rows={4}
          className='w-full mb-6 px-3 py-2 text-[var(--text)] bg-[var(--bg)] border border-[var(--border)] rounded-lg outline-none resize-none placeholder:text-[var(--muted)] focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition'
        />

        <div className='flex justify-end gap-3'>
          <button
            onClick={onClose}
            className='px-4 py-2 text-sm font-medium text-[var(--text)] bg-[var(--bg)] border border-[var(--border)] rounded-lg hover:bg-[var(--hover)] transition'
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            disabled={!title.trim()}
            className='px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition disabled:opacity-50 disabled:cursor-not-allowed'
          >
            {mode === 'add' ? 'Add card' : 'Save changes'}
          </button>
        </div>
      </div>
    </div>
  )
}

export default CardModal