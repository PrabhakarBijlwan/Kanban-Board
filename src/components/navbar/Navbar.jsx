import React from 'react'

function Navbar({ search, setSearch, dark, toggleDark }) {
  return (
    <header className='flex flex-wrap items-center justify-between gap-3 px-4 md:px-8 py-3 bg-[var(--nav)] border-b border-[var(--border)]'>
      <span className='order-1 text-blue-600 font-bold text-2xl'>Taskboard</span>

      <button
        onClick={toggleDark}
        aria-label={dark ? 'Switch to light mode' : 'Switch to dark mode'}
        className='order-2 md:order-3 h-10 px-4 flex items-center gap-2 text-sm text-[var(--text)] border border-[var(--border)] rounded-lg hover:bg-[var(--hover)] transition'
      >
        <span>{dark ? '☀️' : '🌙'}</span>
        <span className='hidden sm:inline'>{dark ? 'Light mode' : 'Dark mode'}</span>
      </button>

      <div className='order-3 md:order-2 relative w-full md:w-72 md:ml-auto md:mr-3'>
        <input
          type='text'
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Escape') setSearch('')
          }}
          placeholder='Search cards'
          className='w-full h-10 pl-3 pr-9 text-[var(--text)] bg-[var(--surface)] border border-[var(--border)] rounded-lg outline-none placeholder:text-[var(--muted)] focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition'
        />
        {search && (
          <button
            onClick={() => setSearch('')}
            aria-label='Clear search'
            className='absolute right-2 top-1/2 -translate-y-1/2 w-6 h-6 flex items-center justify-center rounded-full text-[var(--muted)] hover:bg-[var(--hover)]'
          >
            ✕
          </button>
        )}
      </div>
    </header>
  )
}

export default Navbar