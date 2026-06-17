function ProgramCard({ program, onApply, applying, hideApply, isExpanded, onToggleExpand }) {
  let formattedDate = 'Date to be announced'
  let formattedYear = ''

  if (program.date) {
    const d = new Date(program.date)
    formattedDate = d.toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })
    formattedYear = d.toLocaleDateString('en-IN', { year: 'numeric' })
  }

  return (
    <article className="rounded-2xl border border-white/10 bg-white/5 p-6 shadow-2xl backdrop-blur-md transition-all hover:bg-white/10 hover:border-emerald-500/50 flex flex-col">
      <div className="mb-4 flex items-start justify-between gap-3">
        <div>
          <p className="text-xs font-bold uppercase tracking-wide text-emerald-400">
            {program.category}
          </p>
          <h3 className="mt-1 text-2xl font-bold text-white line-clamp-2 h-[4rem] pr-2">{program.title}</h3>
        </div>
        <div className="flex min-w-[4.5rem] shrink-0 flex-col items-center justify-center rounded-md border border-emerald-500/30 bg-emerald-500/20 px-2 py-1.5 text-center text-xs font-bold text-emerald-300">
          {formattedYear ? (
            <>
              <span className="whitespace-nowrap">{formattedDate}</span>
              <span className="whitespace-nowrap">{formattedYear}</span>
            </>
          ) : (
            <span className="whitespace-nowrap">{formattedDate}</span>
          )}
        </div>
      </div>

      <div className={`flex flex-col ${isExpanded ? 'h-fit' : 'h-[6.5rem]'}`}>
        <p className={`text-sm leading-relaxed text-stone-400 flex-1 ${!isExpanded ? 'line-clamp-3' : ''}`}>
          {program.description}
        </p>
        <div className="h-6 mt-1 shrink-0">
          {program.description?.length > 120 && (
            <button 
              onClick={onToggleExpand}
              className="text-xs font-bold text-emerald-400 hover:text-emerald-300 transition-colors focus:outline-none"
            >
              {isExpanded ? 'View less' : 'Read more...'}
            </button>
          )}
        </div>
      </div>

      <div className="mt-6 flex items-center justify-between gap-3 border-t border-white/10 pt-4">
        <span className="text-sm font-semibold text-stone-300">📍 {program.location}</span>
        {!hideApply && (
          <button
            onClick={() => onApply(program._id)}
            disabled={applying}
            className="rounded-full bg-emerald-600 px-6 py-2 text-sm font-bold text-white shadow-lg shadow-emerald-900/50 transition-all hover:-translate-y-1 hover:bg-emerald-500 hover:shadow-emerald-900/80 disabled:opacity-50 disabled:hover:translate-y-0 disabled:shadow-none"
          >
            {applying ? 'Applying...' : 'Apply'}
          </button>
        )}
      </div>
    </article>
  )
}

export default ProgramCard
