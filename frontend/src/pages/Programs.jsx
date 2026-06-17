import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import api from '../api/axios.js'
import ProgramCard from '../components/ProgramCard.jsx'
import { useAuth } from '../context/auth.js'

function Programs() {
  const { user } = useAuth()
  const navigate = useNavigate()
  const [programs, setPrograms] = useState([])
  const [message, setMessage] = useState('')
  const [messageType, setMessageType] = useState('success')
  const [loading, setLoading] = useState(true)
  const [applyingId, setApplyingId] = useState('')
  const [expandedId, setExpandedId] = useState(null)
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)

  useEffect(() => {
    async function fetchPrograms() {
      setLoading(true)
      try {
        const response = await api.get(`/programs?page=${page}&limit=12`)
        setPrograms(response.data.programs)
        setTotalPages(Math.max(1, Math.ceil(response.data.totalCount / 12)))
      } catch (error) {
        setMessage(error.response?.data?.msg || 'Could not load programs')
        setMessageType('error')
      } finally {
        setLoading(false)
      }
    }

    fetchPrograms()
  }, [page])

  async function applyToProgram(programId) {
    if (!user) {
      navigate('/login', { state: { message: "Please login before applying.", type: "error" } })
      return
    }

    setApplyingId(programId)
    setMessage('')

    try {
      const response = await api.post(`/application/${programId}`)
      setMessage(response.data.msg)
      setMessageType('success')
      setTimeout(() => setMessage(''), 3000)
    } catch (error) {
      const errorMsg = error.response?.data?.msg || 'Could not apply'
      if (errorMsg === "No volunteer profile found") {
        navigate('/volunteer/dashboard', { state: { message: "You need to register as a volunteer to apply.", type: "error" } })
        return
      }
      setMessage(errorMsg)
      setMessageType('error')
      setTimeout(() => setMessage(''), 3000)
    } finally {
      setApplyingId('')
    }
  }

  return (
    <main className="relative z-10 mx-auto max-w-6xl px-4 py-10">
      <div className="mb-8 flex flex-col justify-between gap-4 md:flex-row md:items-end">
        <div>
          <p className="text-sm font-bold uppercase tracking-wide text-emerald-400">
            Volunteer programs
          </p>
          <h1 className="mt-2 text-4xl font-bold text-white">Find a cause to support</h1>
        </div>

        {user && user.role !== 'Admin' && (
          <Link
            to="/volunteer/dashboard"
            className="rounded-full bg-emerald-600 px-6 py-3 font-bold text-white shadow-lg shadow-emerald-900/50 transition-all hover:-translate-y-1 hover:bg-emerald-500 hover:shadow-emerald-900/80"
          >
            My Applications
          </Link>
        )}
      </div>

      {message && (
        <div className={`fixed top-24 left-1/2 -translate-x-1/2 z-50 w-[90%] max-w-md flex items-center justify-center rounded-xl border p-4 text-sm font-medium shadow-2xl backdrop-blur-md ${
          messageType === 'error' ? 'border-red-400 bg-red-600/95 text-white' : 'border-emerald-500/40 bg-emerald-900/95 text-emerald-400'
        }`}>
          <p className="text-base text-center">{message}</p>
        </div>
      )}

      {loading ? (
        <p className="rounded-2xl border border-white/10 bg-white/5 p-8 text-stone-400 shadow-2xl backdrop-blur-md">Loading programs...</p>
      ) : programs.length === 0 ? (
        <p className="rounded-2xl border border-white/10 bg-white/5 p-8 text-stone-400 shadow-2xl backdrop-blur-md">No programs found.</p>
      ) : (
        <div className={`grid gap-6 md:grid-cols-2 lg:grid-cols-3 ${expandedId ? 'items-start' : 'items-stretch'}`}>
          {programs.map((program) => (
            <ProgramCard
              key={program._id}
              program={program}
              onApply={applyToProgram}
              applying={applyingId === program._id}
              hideApply={user?.role?.toLowerCase() === 'admin'}
              isExpanded={expandedId === program._id}
              onToggleExpand={() => setExpandedId(expandedId === program._id ? null : program._id)}
            />
          ))}
        </div>
      )}

      {!loading && programs.length > 0 && totalPages > 1 && (
        <div className="mt-8 flex justify-center gap-2">
          <button
            disabled={page === 1}
            onClick={() => setPage(p => Math.max(1, p - 1))}
            className="rounded-lg bg-emerald-600 px-6 py-2 font-bold text-white shadow-lg shadow-emerald-900/50 transition-colors hover:bg-emerald-500 disabled:opacity-50 disabled:cursor-not-allowed border border-emerald-500/30"
          >
            Previous
          </button>
          <span className="flex items-center px-4 font-semibold text-white">
            Page {page} of {totalPages}
          </span>
          <button
            disabled={page >= totalPages}
            onClick={() => setPage(p => Math.min(totalPages, p + 1))}
            className="rounded-lg bg-emerald-600 px-6 py-2 font-bold text-white shadow-lg shadow-emerald-900/50 transition-colors hover:bg-emerald-500 disabled:opacity-50 disabled:cursor-not-allowed border border-emerald-500/30"
          >
            Next
          </button>
        </div>
      )}
    </main>
  )
}

export default Programs
