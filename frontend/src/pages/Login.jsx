import { useState, useEffect } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { useAuth } from '../context/auth.js'

function Login() {
  const navigate = useNavigate()
  const location = useLocation()
  const { login } = useAuth()
  
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
  const [form, setForm] = useState({ email: '', password: '' })
  const [message, setMessage] = useState('')
  const [loading, setLoading] = useState(false)

  function updateField(event) {
    setForm({ ...form, [event.target.name]: event.target.value })
  }

  async function handleSubmit(event) {
    event.preventDefault()
    setLoading(true)
    setMessage('')

    try {
      const user = await login(form)
      navigate(user.role === 'Admin' ? '/admin/dashboard' : '/')
    } catch (error) {
      setMessage(error.response?.data?.msg || 'Login failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <main className="relative z-10 mx-auto max-w-md px-4 pt-32 pb-10">
      {toastNotification}
      <FormHeader title="Welcome back" text="Login to manage programs and applications." />
      <form onSubmit={handleSubmit} className="mt-8 rounded-2xl border border-white/10 bg-white/5 p-8 shadow-2xl backdrop-blur-md">
        <Input
          label="Email"
          name="email"
          type="email"
          value={form.email}
          onChange={updateField}
          placeholder="you@example.com"
        />
        <Input
          label="Password"
          name="password"
          type="password"
          value={form.password}
          onChange={updateField}
          placeholder="••••••••"
        />
        {message && <p className="mb-4 rounded-xl bg-red-500/10 p-4 text-sm font-medium text-red-400 border border-red-500/20">{message}</p>}
        <button
          disabled={loading}
          className="mt-2 w-full rounded-full bg-emerald-600 px-4 py-3 font-bold text-white shadow-lg shadow-emerald-900/50 transition-all hover:-translate-y-1 hover:bg-emerald-500 hover:shadow-emerald-900/80 disabled:opacity-50 disabled:hover:translate-y-0 disabled:shadow-none"
        >
          {loading ? 'Logging in...' : 'Login'}
        </button>
        <p className="mt-6 text-center text-sm text-stone-400">
          New here?{' '}
          <Link to="/register" className="font-bold text-emerald-400 hover:text-emerald-300 transition-colors">
            Create account
          </Link>
        </p>
      </form>
    </main>
  )
}

function FormHeader({ title, text }) {
  return (
    <div className="text-center">
      <h1 className="text-4xl font-bold text-white">{title}</h1>
      <p className="mt-2 text-stone-400">{text}</p>
    </div>
  )
}

function Input({ label, ...props }) {
  return (
    <label className="mb-4 block">
      <span className="mb-1 block text-sm font-semibold text-stone-300">{label}</span>
      <input
        required
        {...props}
        className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 text-white outline-none focus:border-emerald-500 focus:bg-white/10 placeholder-stone-500 transition-colors"
      />
    </label>
  )
}

export default Login
