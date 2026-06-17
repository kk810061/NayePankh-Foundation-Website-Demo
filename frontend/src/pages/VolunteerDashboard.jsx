import { useEffect, useState } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import api from '../api/axios.js'

function VolunteerDashboard() {
  const navigate = useNavigate()
  const location = useLocation()
  
  const [toastMsg, setToastMsg] = useState(location.state?.message || '')
  const [toastType, setToastType] = useState(location.state?.type || 'success')

  useEffect(() => {
    if (location.state?.message) {
      navigate(location.pathname, { replace: true, state: {} })
    }
  }, [location.state?.message, location.pathname, navigate])

  useEffect(() => {
    if (toastMsg) {
      const timer = setTimeout(() => {
        setToastMsg('')
      }, 3000)
      return () => clearTimeout(timer)
    }
  }, [toastMsg])

  const toastNotification = toastMsg && (
    <div className={`fixed top-24 left-1/2 -translate-x-1/2 z-50 w-[90%] max-w-md flex items-center justify-center rounded-xl border p-4 text-sm font-medium shadow-2xl backdrop-blur-md ${
      toastType === 'error' ? 'border-red-400 bg-red-600/95 text-white' : 'border-emerald-500/40 bg-emerald-900/95 text-emerald-400'
    }`}>
      <p className="text-base text-center w-full">{toastMsg}</p>
    </div>
  )
  
  const [loadingInitial, setLoadingInitial] = useState(true)
  const [profile, setProfile] = useState(null)
  
  const [form, setForm] = useState({
    phone: '',
    city: '',
    skills: '',
    availability: '',
  })
  const [regMessage, setRegMessage] = useState('')
  const [regLoading, setRegLoading] = useState(false)
  
  const [appMessage, setAppMessage] = useState('')

  useEffect(() => {
    async function fetchInitialState() {
      try {
        const response = await api.get('/volunteer/my')
        const fetchedProfile = response.data.volunteer
        setProfile(fetchedProfile)
        
        if (fetchedProfile.status === 'approved') {
          fetchApplications()
        }
      } catch (error) {
      } finally {
        setLoadingInitial(false)
      }
    }
    fetchInitialState()
  }, [])

  async function fetchApplications() {
    setAppLoading(true)
    try {
      const response = await api.get('/application/my')
      setApplications(response.data.applications)
    } catch (error) {
      setAppMessage(error.response?.data?.msg || 'No applications yet')
    } finally {
      setAppLoading(false)
    }
  }

  // Form Handlers
  function updateField(event) {
    setForm({ ...form, [event.target.name]: event.target.value })
  }

  async function createProfile(event) {
    event.preventDefault()
    setRegMessage('')
    setRegLoading(true)

    try {
      const payload = {
        ...form,
        skills: form.skills.split(',').map((skill) => skill.trim()).filter(Boolean),
      }
      const response = await api.post('/volunteer', payload)
      setProfile(response.data.newVolunteer) // Update profile to trigger next state
      setRegMessage('')
    } catch (error) {
      setRegMessage(error.response?.data?.msg || 'Could not create volunteer profile')
    } finally {
      setRegLoading(false)
    }
  }

  if (loadingInitial) {
    return (
      <main className="relative z-10 mx-auto max-w-2xl px-4 py-20 text-center text-white">
        Loading dashboard...
      </main>
    )
  }

  if (!profile) {
    return (
      <main className="relative z-10 mx-auto max-w-2xl px-4 pt-32 pb-10">
        {toastNotification}
        <div className="text-center">
          <h1 className="text-4xl font-bold text-white">Register as a Volunteer</h1>
          <p className="mt-2 text-stone-400">Create your volunteer profile to start applying for programs.</p>
        </div>

        <form onSubmit={createProfile} className="mt-8 rounded-2xl border border-white/10 bg-white/5 p-8 shadow-2xl backdrop-blur-md">
          {regMessage && (
            <p className="mb-6 rounded-xl bg-emerald-500/10 p-4 text-sm font-medium text-emerald-400 border border-emerald-500/20">
              {regMessage}
            </p>
          )}
          <div className="grid gap-4 md:grid-cols-2">
            <Input label="Phone" name="phone" value={form.phone} onChange={updateField} placeholder="+91 9876543210" />
            <Input label="City" name="city" value={form.city} onChange={updateField} placeholder="New Delhi" />
            <Input
              label="Skills (comma separated)"
              name="skills"
              value={form.skills}
              onChange={updateField}
              placeholder="Teaching, planning, first aid"
            />
            <Input
              label="Availability"
              name="availability"
              value={form.availability}
              onChange={updateField}
              placeholder="Weekends"
            />
          </div>
          <button 
            disabled={regLoading}
            className="mt-6 w-full rounded-full bg-emerald-600 px-4 py-3 font-bold text-white shadow-lg shadow-emerald-900/50 transition-all hover:-translate-y-1 hover:bg-emerald-500 hover:shadow-emerald-900/80 disabled:opacity-50 disabled:hover:translate-y-0 disabled:shadow-none"
          >
            {regLoading ? 'Saving Profile...' : 'Complete Registration'}
          </button>
        </form>
      </main>
    )
  }

  if (profile.status !== 'approved') {
    return (
      <main className="relative z-10 mx-auto max-w-2xl px-4 pt-24 pb-8">
        {toastNotification}
        <div className="text-center">
          <h1 className="text-4xl font-bold text-white">Your Volunteer Profile</h1>
          <p className="mt-2 text-stone-400">View your registration details and status.</p>
        </div>

        <div className="mt-6 rounded-2xl border border-white/10 bg-white/5 p-6 shadow-2xl backdrop-blur-md">
          <div className="flex items-center justify-between border-b border-white/10 pb-3 mb-3">
            <span className="text-sm font-semibold text-stone-300">Application Status</span>
            <span className={`rounded-md border px-3 py-1 text-xs font-bold capitalize ${
              profile.status === 'rejected' ? 'bg-red-500/20 border-red-500/30 text-red-300' :
              'bg-amber-500/20 border-amber-500/30 text-amber-300'
            }`}>
              {profile.status}
            </span>
          </div>

          <div className="grid gap-3">
            <div>
              <span className="block text-sm font-semibold text-stone-300 mb-1">Phone</span>
              <p className="text-white bg-white/5 rounded-xl px-3 py-2 border border-white/10">{profile.phone}</p>
            </div>
            <div>
              <span className="block text-sm font-semibold text-stone-300 mb-1">City</span>
              <p className="text-white bg-white/5 rounded-xl px-3 py-2 border border-white/10">{profile.city}</p>
            </div>
            <div>
              <span className="block text-sm font-semibold text-stone-300 mb-1">Skills</span>
              <div className="flex flex-wrap gap-2 mt-2">
                {profile.skills.map(skill => (
                  <span key={skill} className="rounded-full bg-emerald-500/20 px-3 py-1 text-xs font-bold text-emerald-300 border border-emerald-500/30">{skill}</span>
                ))}
              </div>
            </div>
            <div>
              <span className="block text-sm font-semibold text-stone-300 mb-1">Availability</span>
              <p className="text-white bg-white/5 rounded-xl px-3 py-2 border border-white/10">{profile.availability}</p>
            </div>
          </div>
        </div>
      </main>
    )
  }

  return (
    <main className="relative z-10 mx-auto max-w-4xl px-4 pt-32 pb-10">
      {toastNotification}
      <div className="mb-8 flex items-center justify-between">
        <div>
          <p className="text-sm font-bold uppercase tracking-wide text-emerald-400">
            Volunteer dashboard
          </p>
          <h1 className="mt-2 text-4xl font-bold text-white">Your Applications</h1>
        </div>
        <Link 
          to="/programs"
          className="rounded-full border border-white/10 bg-white/5 backdrop-blur-md px-6 py-3 font-bold text-white hover:bg-white/10 hover:border-emerald-500 transition-colors"
        >
          Browse Programs
        </Link>
      </div>

      <section className="rounded-2xl border border-white/10 bg-white/5 p-8 shadow-2xl backdrop-blur-md">
        {appLoading ? (
          <p className="mt-4 text-stone-400">Loading applications...</p>
        ) : applications.length === 0 ? (
          <div className="py-8 text-center">
            <p className="text-stone-300">You haven't applied to any programs yet.</p>
            <p className="mt-2 text-sm text-stone-500">Check out our available programs and start making an impact!</p>
          </div>
        ) : (
          <div className="mt-2 grid gap-4">
            {applications.map((application) => (
              <div
                key={application._id}
                className="rounded-xl border border-white/10 bg-white/5 p-5 transition-colors hover:bg-white/10 hover:border-emerald-500/30"
              >
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <h3 className="text-xl font-bold text-white">
                      {application.program?.title}
                    </h3>
                    <p className="mt-1 text-sm text-stone-400">
                      📍 {application.program?.location}
                    </p>
                  </div>
                  <span className={`rounded-md border px-3 py-1 text-xs font-bold capitalize ${
                    application.status === 'approved' ? 'bg-emerald-500/20 border-emerald-500/30 text-emerald-300' :
                    application.status === 'rejected' ? 'bg-red-500/20 border-red-500/30 text-red-300' :
                    'bg-amber-500/20 border-amber-500/30 text-amber-300'
                  }`}>
                    {application.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </main>
  )
}

function Input({ label, ...props }) {
  return (
    <label className="mb-2 block">
      <span className="mb-2 block text-sm font-semibold text-stone-300">{label}</span>
      <input
        required
        {...props}
        className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-white outline-none focus:border-emerald-500 focus:bg-white/10 placeholder-stone-500 transition-colors"
      />
    </label>
  )
}

export default VolunteerDashboard
