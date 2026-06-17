import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/auth.js'

function Register() {
  const navigate = useNavigate()
  const { register } = useAuth()
  const [form, setForm] = useState({ name: '', email: '', password: '' })
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
      await register(form)
      navigate('/')
    } catch (error) {
      setMessage(error.response?.data?.msg || 'Registration failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <main className="relative z-10 mx-auto max-w-md px-4 pt-32 pb-10">
      <div className="text-center">
        <h1 className="text-4xl font-bold text-white">Join NayePankh</h1>
        <p className="mt-2 text-stone-400">Create an account to apply for programs.</p>
      </div>

      <form onSubmit={handleSubmit} className="mt-8 rounded-2xl border border-white/10 bg-white/5 p-8 shadow-2xl backdrop-blur-md">
        <Input label="Name" name="name" value={form.name} onChange={updateField} placeholder="John Doe" />
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
          {loading ? 'Creating...' : 'Create Account'}
        </button>
        <p className="mt-6 text-center text-sm text-stone-400">
          Already have an account?{' '}
          <Link to="/login" className="font-bold text-emerald-400 hover:text-emerald-300 transition-colors">
            Login
          </Link>
        </p>
      </form>
    </main>
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

export default Register
