import { useEffect, useState } from 'react'
import { createPortal } from 'react-dom'
import api from '../api/axios.js'
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
} from 'chart.js'
import { Bar, Doughnut } from 'react-chartjs-2'

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, ArcElement)

const tabs = ['Dashboard', 'Volunteers', 'Programs', 'Applications']

function AdminDashboard() {
  const [activeTab, setActiveTab] = useState('Dashboard')
  const [stats, setStats] = useState(null)
  const [message, setMessage] = useState('')
  const [messageType, setMessageType] = useState('success')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (message) {
      const timer = setTimeout(() => setMessage(''), 3000)
      return () => clearTimeout(timer)
    }
  }, [message])

  const toastNotification = message && (
    <div className={`fixed top-24 left-1/2 -translate-x-1/2 z-[100] w-[90%] max-w-md flex items-center justify-center rounded-xl border p-4 text-sm font-medium shadow-2xl backdrop-blur-md ${
      messageType === 'error' ? 'border-red-400 bg-red-600/95 text-white' : 'border-emerald-500/40 bg-emerald-900/95 text-emerald-400'
    }`}>
      <p className="text-base text-center w-full">{message}</p>
    </div>
  )

  useEffect(() => {
    loadAdminData()
  }, [])

  async function loadAdminData() {
    setLoading(true)
    setMessage('')

    try {
      const statsRes = await api.get('/admin/stats')
      setStats(statsRes.data)
    } catch (error) {
      setMessage(error.response?.data?.msg || 'Could not load stats')
      setMessageType('error')
    } finally {
      setLoading(false)
    }
  }



  return (
    <main className="relative z-10 mx-auto max-w-7xl px-4 py-10">
      <div className="grid gap-6 lg:grid-cols-[220px_1fr] items-start">
        <aside className="sticky top-24 rounded-2xl border border-white/10 bg-white/5 p-5 text-white shadow-2xl backdrop-blur-md">
          <h1 className="px-3 text-xl font-black">Admin</h1>
          <div className="mt-6 grid gap-2">
            {tabs.map((tab) => (
              <button
                key={tab}
                onClick={() => {
                  setActiveTab(tab)
                  setMessage('')
                }}
                className={`rounded-xl px-4 py-3 text-left text-sm font-bold transition-colors ${
                  activeTab === tab
                    ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                    : 'text-stone-400 hover:bg-white/10 hover:text-white'
                }`}
              >
                {tab}
              </button>
            ))}
          </div>
        </aside>

        <section className="min-w-0">
          <div className="mb-6 flex flex-col justify-between gap-3 md:flex-row md:items-center">
            <div>
              <p className="text-sm font-bold uppercase tracking-wide text-emerald-400">
                NayePankh control center
              </p>
              <h2 className="mt-1 text-4xl font-bold text-white">{activeTab}</h2>
            </div>
          </div>

          {toastNotification}

          {loading ? (
            <div className="rounded-2xl border border-white/10 bg-white/5 p-8 text-stone-400 shadow-2xl backdrop-blur-md">Loading dashboard...</div>
          ) : (
            <>
              {activeTab === 'Dashboard' && <DashboardTab stats={stats} />}
              {activeTab === 'Volunteers' && (
                <VolunteersTab onUpdateStats={loadAdminData} />
              )}
              {activeTab === 'Programs' && (
                <ProgramsTab onUpdateStats={loadAdminData} onSetGlobalMessage={(m, t) => { setMessage(m); setMessageType(t); }} />
              )}
              {activeTab === 'Applications' && (
                <ApplicationsTab onUpdateStats={loadAdminData} />
              )}
            </>
          )}
        </section>
      </div>
    </main>
  )
}

function DashboardTab({ stats }) {
  const cards = [
    {
      label: 'Volunteers',
      value: stats?.volunteers?.totalVolunteers || 0,
      hint: `${stats?.volunteers?.pendingVolunteers || 0} pending`,
    },
    {
      label: 'Programs',
      value: stats?.programs?.totalPrograms || 0,
      hint: 'Active opportunities',
    },
    {
      label: 'Applications',
      value: stats?.applications?.totalApplications || 0,
      hint: `${stats?.applications?.pendingApplications || 0} pending`,
    },
  ]

  const vTotal = stats?.volunteers?.totalVolunteers || 0
  const vPending = stats?.volunteers?.pendingVolunteers || 0
  const vApproved = stats?.volunteers?.approvedVolunteers || 0
  const vRejected = vTotal - vPending - vApproved

  const volunteerData = {
    labels: ['Pending', 'Approved', 'Rejected'],
    datasets: [
      {
        label: 'Volunteers',
        data: [vPending, vApproved, vRejected],
        backgroundColor: [
          'rgba(245, 158, 11, 0.6)', 
          'rgba(16, 185, 129, 0.6)',
          'rgba(239, 68, 68, 0.6)'
        ],
        borderColor: [
          'rgba(245, 158, 11, 1)',
          'rgba(16, 185, 129, 1)',
          'rgba(239, 68, 68, 1)'
        ],
        borderWidth: 1,
      },
    ],
  }

  const programLabels = stats?.programs?.programStats?.map(p => p._id) || []
  const programData = stats?.programs?.programStats?.map(p => p.count) || []
  const bgColors = ['rgba(52, 211, 153, 0.6)', 'rgba(96, 165, 250, 0.6)', 'rgba(248, 113, 113, 0.6)', 'rgba(250, 204, 21, 0.6)', 'rgba(167, 139, 250, 0.6)', 'rgba(236, 72, 153, 0.6)']
  const borderColors = ['rgba(52, 211, 153, 1)', 'rgba(96, 165, 250, 1)', 'rgba(248, 113, 113, 1)', 'rgba(250, 204, 21, 1)', 'rgba(167, 139, 250, 1)', 'rgba(236, 72, 153, 1)']

  const programsChartData = {
    labels: programLabels.length ? programLabels : ['None'],
    datasets: [{
      label: 'Programs by Category',
      data: programData.length ? programData : [1],
      backgroundColor: bgColors.slice(0, Math.max(1, programLabels.length)),
      borderColor: borderColors.slice(0, Math.max(1, programLabels.length)),
      borderWidth: 1
    }]
  }

  const aTotal = stats?.applications?.totalApplications || 0
  const aPending = stats?.applications?.pendingApplications || 0
  const aApproved = stats?.applications?.approvedApplications || 0
  const aRejected = aTotal - aPending - aApproved

  const applicationsData = {
    labels: ['Pending', 'Approved', 'Rejected'],
    datasets: [
      {
        label: 'Applications',
        data: [aPending, aApproved, aRejected],
        backgroundColor: [
          'rgba(245, 158, 11, 0.6)', 
          'rgba(16, 185, 129, 0.6)',
          'rgba(239, 68, 68, 0.6)'
        ],
        borderColor: [
          'rgba(245, 158, 11, 1)',
          'rgba(16, 185, 129, 1)',
          'rgba(239, 68, 68, 1)'
        ],
        borderWidth: 1,
      },
    ],
  }

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: { display: false }, 
    },
    scales: {
      y: { ticks: { color: '#a8a29e' }, grid: { color: 'rgba(255,255,255,0.05)' } },
      x: { ticks: { color: '#a8a29e' }, grid: { color: 'rgba(255,255,255,0.05)' } }
    }
  }

  const doughnutOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { 
        position: 'right', 
        labels: { 
          color: '#a8a29e',
          padding: 24 
        } 
      },
    },
  }

  const programDoughnutOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { 
        position: 'right', 
        labels: { 
          color: '#a8a29e',
          padding: 24 
        } 
      },
    },
  }

  return (
    <>
      <div className="grid gap-5 md:grid-cols-3 mb-6">
        {cards.map((card) => (
          <div key={card.label} className="rounded-2xl border border-white/10 bg-white/5 p-6 shadow-2xl backdrop-blur-md">
            <p className="text-sm font-bold uppercase tracking-wide text-stone-400">{card.label}</p>
            <p className="mt-3 text-4xl font-black text-white">{card.value}</p>
            <p className="mt-2 text-sm font-semibold text-emerald-400">{card.hint}</p>
          </div>
        ))}
      </div>
      <div className="grid gap-5 lg:grid-cols-2">
        <div className="rounded-2xl border border-white/10 bg-white/5 p-6 shadow-2xl backdrop-blur-md flex flex-col justify-center">
           <h3 className="text-lg font-bold text-white mb-4 text-center">Volunteer Status</h3>
           <Bar data={volunteerData} options={chartOptions} />
        </div>
        <div className="rounded-2xl border border-white/10 bg-white/5 p-6 shadow-2xl backdrop-blur-md flex flex-col items-center justify-center">
           <h3 className="text-lg font-bold text-white mb-4 text-center">Applications Overview</h3>
           <div className="w-full max-w-[300px] h-[220px] flex justify-center">
             <Doughnut data={applicationsData} options={doughnutOptions} />
           </div>
        </div>
        <div className="lg:col-span-2 rounded-2xl border border-white/10 bg-white/5 p-6 shadow-2xl backdrop-blur-md flex flex-col items-center justify-center min-h-[300px]">
           <h3 className="text-lg font-bold text-white mb-4 text-center">Program Categories</h3>
           <div className="w-full max-w-[500px] h-[220px] flex justify-center">
             <Doughnut data={programsChartData} options={programDoughnutOptions} />
           </div>
        </div>
      </div>
    </>
  )
}

function VolunteersTab({ onUpdateStats }) {
  const [view, setView] = useState('pending')
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [volunteers, setVolunteers] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function loadVolunteers() {
      setLoading(true)
      try {
        const res = await api.get(`/volunteer?status=${view}&page=${page}&limit=5`)
        setVolunteers(res.data.volunteers)
        setTotalPages(Math.max(1, Math.ceil(res.data.totalCount / 5)))
      } catch (err) {
        console.error(err)
      } finally {
        setLoading(false)
      }
    }
    loadVolunteers()
  }, [view, page])

  async function handleUpdate(id, status) {
    try {
      await api.patch(`/volunteer/${id}/status`, { status })
      // Refresh current page
      const res = await api.get(`/volunteer?status=${view}&page=${page}&limit=5`)
      setVolunteers(res.data.volunteers)
      setTotalPages(Math.max(1, Math.ceil(res.data.totalCount / 5)))
      if (onUpdateStats) onUpdateStats()
    } catch (err) {
      console.error(err)
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex w-fit rounded-lg bg-white/5 p-1 backdrop-blur-md border border-white/10">
        <button
          onClick={() => { setView('pending'); setPage(1); }}
          className={`rounded-md px-6 py-2 text-sm font-bold transition-all ${view === 'pending' ? 'bg-emerald-600 text-white shadow-md' : 'text-stone-400 hover:text-white'}`}
        >
          Pending
        </button>
        <button
          onClick={() => { setView('processed'); setPage(1); }}
          className={`rounded-md px-6 py-2 text-sm font-bold transition-all ${view === 'processed' ? 'bg-emerald-600 text-white shadow-md' : 'text-stone-400 hover:text-white'}`}
        >
          Processed
        </button>
      </div>

      {loading ? (
        <p className="text-stone-400">Loading volunteers...</p>
      ) : volunteers.length === 0 ? (
        <p className="text-stone-400">No {view} volunteers.</p>
      ) : (
        <div className="overflow-hidden rounded-2xl border border-white/10 bg-white/5 shadow-2xl backdrop-blur-md">
          <VolunteerHeader />
          <div className="divide-y divide-white/10">
            {volunteers.map((volunteer) => (
              <VolunteerRow key={volunteer._id} volunteer={volunteer} onUpdate={handleUpdate} showActions={view === 'pending'} />
            ))}
          </div>
        </div>
      )}

      {!loading && totalPages > 1 && (
        <div className="mt-6 flex justify-center gap-2">
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
    </div>
  )
}

function VolunteerHeader() {
  return (
    <div className="hidden border-b border-white/10 bg-white/5 px-5 py-4 text-xs font-bold uppercase tracking-wider text-stone-400 md:grid md:grid-cols-5 gap-4">
      <span className="col-span-2">Volunteer</span>
      <span className="col-span-1">Details</span>
      <span className="col-span-1">Status</span>
      <span className="col-span-1">Action</span>
    </div>
  )
}

function VolunteerRow({ volunteer, onUpdate, showActions }) {
  const formattedSkills = Array.isArray(volunteer.skills) 
    ? volunteer.skills.join(', ') 
    : volunteer.skills || 'None listed'

  return (
    <div className="grid items-start gap-4 p-5 md:grid-cols-5">
      <div className="col-span-2 min-w-0">
        <p className="font-bold text-white truncate">{volunteer.user?.name}</p>
        <p className="text-sm text-stone-400 truncate">{volunteer.user?.email}</p>
        <p className="mt-2 text-sm font-semibold text-emerald-400 truncate">📍 {volunteer.city}</p>
        {volunteer.phone && <p className="text-sm text-stone-400 truncate">📞 {volunteer.phone}</p>}
      </div>
      <div className="col-span-1 min-w-0">
        <p className="text-sm font-bold text-stone-300">Skills:</p>
        <p className="text-sm text-stone-400 mb-2 break-words leading-tight">{formattedSkills}</p>
        <p className="text-sm font-bold text-stone-300">Availability:</p>
        <p className="text-sm text-stone-400 truncate">{volunteer.availability || 'Not specified'}</p>
      </div>
      <div className="col-span-1 flex items-start">
        <StatusBadge status={volunteer.status} />
      </div>
      <div className="col-span-1 flex items-start">
        {showActions ? (
          <ActionButtons onApprove={() => onUpdate(volunteer._id, 'approved')} onReject={() => onUpdate(volunteer._id, 'rejected')} />
        ) : (
          <span className="text-sm text-stone-500 font-semibold uppercase tracking-wider">Processed</span>
        )}
      </div>
    </div>
  )
}

function ProgramsTab({ onUpdateStats, onSetGlobalMessage }) {
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [programs, setPrograms] = useState([])
  const [loading, setLoading] = useState(true)
  const [isEditing, setIsEditing] = useState(false)
  const [editingProgram, setEditingProgram] = useState(null)

  useEffect(() => {
    async function loadPrograms() {
      setLoading(true)
      try {
        const res = await api.get(`/programs?page=${page}&limit=6`)
        setPrograms(res.data.programs)
        setTotalPages(Math.max(1, Math.ceil(res.data.totalCount / 6)))
      } catch (err) {
        console.error(err)
      } finally {
        setLoading(false)
      }
    }
    if (!isEditing) {
      loadPrograms()
    }
  }, [page, isEditing])

  function handleAddNew() {
    setEditingProgram(null)
    setIsEditing(true)
  }

  function handleEdit(program) {
    setEditingProgram(program)
    setIsEditing(true)
  }

  function handleCloseForm(successMessage, msgType) {
    setIsEditing(false)
    setEditingProgram(null)
    if (onUpdateStats) onUpdateStats()
    if (successMessage && onSetGlobalMessage) {
      onSetGlobalMessage(successMessage, msgType || 'success')
    }
  }

  if (isEditing) {
    return <ProgramForm program={editingProgram} onClose={handleCloseForm} onSetGlobalMessage={onSetGlobalMessage} />
  }

  return (
    <div>
      <div className="mb-6 flex justify-end md:-mt-16 relative z-10">
        <button
          onClick={handleAddNew}
          className="rounded-full bg-emerald-600 px-6 py-2 text-sm font-bold text-white shadow-lg transition-all hover:-translate-y-1 hover:bg-emerald-500 hover:shadow-emerald-900/50"
        >
          + Add New Program
        </button>
      </div>

      {loading ? (
        <p className="text-stone-400">Loading programs...</p>
      ) : programs.length === 0 ? (
        <p className="text-stone-400">No programs found.</p>
      ) : (
        <div className="grid gap-4 md:grid-cols-2">
          {programs.map((program) => (
            <div key={program._id} className="relative rounded-2xl border border-white/10 bg-white/5 p-6 shadow-2xl backdrop-blur-md">
              <p className="text-xs font-bold uppercase tracking-wide text-emerald-400">
                {program.category}
              </p>
              <h3 className="mt-2 text-2xl font-bold text-white">{program.title}</h3>
              <p className="mt-3 text-sm leading-relaxed text-stone-400 line-clamp-3">{program.description}</p>
              <div className="mt-5 flex items-center justify-between border-t border-white/10 pt-4">
                <span className="text-sm font-bold text-stone-300">📍 {program.location}</span>
                <button
                  onClick={() => handleEdit(program)}
                  className="rounded-md bg-white/10 px-4 py-1.5 text-sm font-bold text-white hover:bg-white/20 transition-colors"
                >
                  Edit
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {!loading && totalPages > 1 && (
        <div className="mt-6 flex justify-center gap-2">
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
    </div>
  )
}

function ProgramForm({ program, onClose, onSetGlobalMessage }) {
  const [form, setForm] = useState(
    program || { title: '', category: '', location: '', date: '', description: '' }
  )
  const [loading, setLoading] = useState(false)
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)

  const isEdit = !!program

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  async function handleSubmit(e) {
    e.preventDefault()
    setLoading(true)
    try {
      if (isEdit) {
        await api.patch(`/programs/${program._id}`, form)
        onClose('Program updated successfully', 'success')
      } else {
        await api.post('/programs', form)
        onClose('Program created successfully', 'success')
      }
    } catch (error) {
      if (onSetGlobalMessage) {
        onSetGlobalMessage(error.response?.data?.msg || 'An error occurred', 'error')
      }
    } finally {
      setLoading(false)
    }
  }

  async function handleDelete() {
    setLoading(true)
    try {
      await api.delete(`/programs/${program._id}`)
      onClose('Program deleted', 'success')
    } catch (error) {
      if (onSetGlobalMessage) {
        onSetGlobalMessage(error.response?.data?.msg || 'Could not delete', 'error')
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="rounded-2xl border border-white/10 bg-white/5 p-6 shadow-2xl backdrop-blur-md">
      <div className="mb-3 flex items-center justify-between">
        <h3 className="text-xl font-bold text-white">{isEdit ? 'Edit Program' : 'Create Program'}</h3>
        <button type="button" onClick={() => onClose()} className="text-stone-400 hover:text-white text-sm">✕ Close</button>
      </div>

      <form onSubmit={handleSubmit} className="grid gap-2">
        <label className="block">
          <span className="mb-0.5 block text-xs font-semibold text-stone-300">Title</span>
          <input required name="title" value={form.title} onChange={handleChange} className="w-full rounded-xl border border-white/10 bg-white/5 px-3 py-1.5 text-white outline-none focus:border-emerald-500" />
        </label>
        <div className="grid gap-3 md:grid-cols-2">
          <label className="block">
            <span className="mb-0.5 block text-xs font-semibold text-stone-300">Category</span>
            <input required name="category" value={form.category} onChange={handleChange} className="w-full rounded-xl border border-white/10 bg-white/5 px-3 py-1.5 text-white outline-none focus:border-emerald-500" />
          </label>
          <label className="block">
            <span className="mb-0.5 block text-xs font-semibold text-stone-300">Location</span>
            <input required name="location" value={form.location} onChange={handleChange} className="w-full rounded-xl border border-white/10 bg-white/5 px-3 py-1.5 text-white outline-none focus:border-emerald-500" />
          </label>
        </div>
        <label className="block">
          <span className="mb-0.5 block text-xs font-semibold text-stone-300">Date</span>
          <input type="date" required name="date" value={form.date ? form.date.split('T')[0] : ''} onChange={handleChange} className="w-full rounded-xl border border-white/10 bg-white/5 px-3 py-1.5 text-white outline-none focus:border-emerald-500" />
        </label>
        <label className="block">
          <span className="mb-0.5 block text-xs font-semibold text-stone-300">Description</span>
          <textarea required rows={5} name="description" value={form.description} onChange={handleChange} className="w-full rounded-xl border border-white/10 bg-white/5 px-3 py-1.5 text-white outline-none focus:border-emerald-500" />
        </label>
        
        <div className="mt-4 flex gap-3">
          <button disabled={loading} className="rounded-full bg-emerald-600 px-6 py-2 font-bold text-white hover:bg-emerald-500 transition-colors">
            {loading ? 'Saving...' : 'Save Program'}
          </button>
          {isEdit && (
            <button type="button" onClick={() => setShowDeleteConfirm(true)} disabled={loading} className="rounded-full border border-red-500/30 bg-red-500/10 px-6 py-2 font-bold text-red-400 hover:bg-red-500/20 transition-colors">
              Delete
            </button>
          )}
        </div>
      </form>

      {showDeleteConfirm && createPortal(
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-md">
          <div className="w-[90%] max-w-sm rounded-2xl border border-white/10 bg-slate-900 p-6 shadow-2xl">
            <h3 className="mb-2 text-xl font-bold text-white">Delete Program</h3>
            <p className="mb-6 text-stone-300">Are you sure you want to delete this program? This action cannot be undone.</p>
            <div className="flex justify-end gap-3">
              <button onClick={() => setShowDeleteConfirm(false)} className="rounded-lg px-4 py-2 font-semibold text-stone-400 hover:text-white transition-colors">
                Cancel
              </button>
              <button onClick={handleDelete} className="rounded-lg bg-red-600 px-4 py-2 font-bold text-white hover:bg-red-500 transition-colors">
                {loading ? 'Deleting...' : 'Yes, Delete'}
              </button>
            </div>
          </div>
        </div>,
        document.body
      )}
    </div>
  )
}

function ApplicationsTab({ onUpdateStats }) {
  const [view, setView] = useState('pending')
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [applications, setApplications] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function loadApplications() {
      setLoading(true)
      try {
        const res = await api.get(`/application?status=${view}&page=${page}&limit=5`)
        setApplications(res.data.applications)
        setTotalPages(Math.max(1, Math.ceil(res.data.totalCount / 5)))
      } catch (err) {
        console.error(err)
      } finally {
        setLoading(false)
      }
    }
    loadApplications()
  }, [view, page])

  async function handleUpdate(id, status) {
    try {
      await api.patch(`/application/${id}/status`, { status })
      // Refresh current page
      const res = await api.get(`/application?status=${view}&page=${page}&limit=5`)
      setApplications(res.data.applications)
      setTotalPages(Math.max(1, Math.ceil(res.data.totalCount / 5)))
      if (onUpdateStats) onUpdateStats()
    } catch (err) {
      console.error(err)
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex w-fit rounded-lg bg-white/5 p-1 backdrop-blur-md border border-white/10">
        <button
          onClick={() => { setView('pending'); setPage(1); }}
          className={`rounded-md px-6 py-2 text-sm font-bold transition-all ${view === 'pending' ? 'bg-emerald-600 text-white shadow-md' : 'text-stone-400 hover:text-white'}`}
        >
          Pending
        </button>
        <button
          onClick={() => { setView('processed'); setPage(1); }}
          className={`rounded-md px-6 py-2 text-sm font-bold transition-all ${view === 'processed' ? 'bg-emerald-600 text-white shadow-md' : 'text-stone-400 hover:text-white'}`}
        >
          Processed
        </button>
      </div>

      {loading ? (
        <p className="text-stone-400">Loading applications...</p>
      ) : applications.length === 0 ? (
        <p className="text-stone-400">No {view} applications.</p>
      ) : (
        <div className="overflow-hidden rounded-2xl border border-white/10 bg-white/5 shadow-2xl backdrop-blur-md">
          <AppHeader />
          <div className="divide-y divide-white/10">
            {applications.map((application) => (
              <AppRow key={application._id} application={application} onUpdate={handleUpdate} showActions={view === 'pending'} />
            ))}
          </div>
        </div>
      )}

      {!loading && totalPages > 1 && (
        <div className="mt-6 flex justify-center gap-2">
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
    </div>
  )
}

function AppHeader() {
  return (
    <div className="hidden border-b border-white/10 bg-white/5 px-5 py-4 text-xs font-bold uppercase tracking-wider text-stone-400 md:grid md:grid-cols-5 gap-4">
      <span className="col-span-2">Volunteer Info</span>
      <span className="col-span-1">Program Details</span>
      <span className="col-span-1">Status</span>
      <span className="col-span-1">Action</span>
    </div>
  )
}

function AppRow({ application, onUpdate, showActions }) {
  const date = application.program?.date ? new Date(application.program.date).toLocaleDateString() : 'TBA'

  const formattedSkills = Array.isArray(application.volunteer?.skills) 
    ? application.volunteer?.skills.join(', ') 
    : application.volunteer?.skills || 'None listed'

  return (
    <div className="grid items-start gap-4 p-5 md:grid-cols-5">
      <div className="col-span-2 min-w-0">
        <p className="font-bold text-white truncate">
          {application.volunteer?.user?.name || 'Unknown User'}
        </p>
        <p className="text-sm text-stone-400 truncate">{application.volunteer?.user?.email}</p>
        <p className="mt-2 text-xs font-semibold text-emerald-400 break-words leading-tight">Skills: {formattedSkills}</p>
      </div>
      <div className="col-span-1 min-w-0">
        <p className="font-bold text-white break-words">{application.program?.title}</p>
        <p className="text-sm text-stone-400 break-words mt-1">📍 {application.program?.location}</p>
        <p className="text-sm text-stone-500 break-words">📅 {date}</p>
      </div>
      <div className="col-span-1 flex items-start">
        <StatusBadge status={application.status} />
      </div>
      <div className="col-span-1 flex items-start">
        {showActions ? (
          <ActionButtons onApprove={() => onUpdate(application._id, 'approved')} onReject={() => onUpdate(application._id, 'rejected')} />
        ) : (
          <span className="text-sm text-stone-500 font-semibold uppercase tracking-wider">Processed</span>
        )}
      </div>
    </div>
  )
}

function StatusBadge({ status }) {
  return (
    <span className={`w-fit rounded-md border px-3 py-1 text-xs font-bold capitalize ${
      status === 'approved' ? 'bg-emerald-500/20 border-emerald-500/30 text-emerald-300' :
      status === 'rejected' ? 'bg-red-500/20 border-red-500/30 text-red-300' :
      'bg-amber-500/20 border-amber-500/30 text-amber-300'
    }`}>
      {status}
    </span>
  )
}

function ActionButtons({ onApprove, onReject }) {
  return (
    <div className="flex flex-col gap-2 xl:flex-row">
      <button
        onClick={onApprove}
        className="rounded-lg bg-emerald-600/80 px-4 py-2 text-sm font-bold text-white transition-colors hover:bg-emerald-500 hover:shadow-lg"
      >
        Approve
      </button>
      <button
        onClick={onReject}
        className="rounded-lg border border-red-500/30 bg-red-500/10 px-4 py-2 text-sm font-bold text-red-400 transition-colors hover:bg-red-500/20"
      >
        Reject
      </button>
    </div>
  )
}

export default AdminDashboard
