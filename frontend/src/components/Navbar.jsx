import { Link, NavLink, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/auth.js'

function Navbar() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()

  const linkClass = ({ isActive }) =>
    `rounded-md px-3 py-2 text-sm font-medium transition-colors ${
      isActive ? 'bg-emerald-600 text-white' : 'text-stone-300 hover:bg-white/10 hover:text-white'
    }`

  function handleLogout() {
    logout()
    navigate('/')
  }

  return (
    <header className="sticky top-0 z-50 border-b border-white/10 bg-slate-950/70 backdrop-blur-md">
      <nav className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
        <Link to="/" className="flex items-center gap-3">
          <img src="/logo.png" alt="NayePankh Logo" className="h-10 w-10 rounded-md bg-white p-0.5 object-contain" />
          <span className="text-xl font-extrabold tracking-wide text-white">NayePankh</span>
        </Link>

        <div className="flex flex-wrap items-center justify-end gap-2">
          <NavLink to="/programs" className={linkClass}>
            Programs
          </NavLink>

          {user?.role === 'Admin' && (
            <NavLink to="/admin/dashboard" className={linkClass}>
              Admin
            </NavLink>
          )}

          {user && user.role !== 'Admin' && (
            <NavLink to="/volunteer/dashboard" className={linkClass}>
              Dashboard
            </NavLink>
          )}

          {!user ? (
            <>
              <NavLink to="/login" className={linkClass}>
                Login
              </NavLink>
              <Link
                to="/register"
                className="rounded-md bg-emerald-600 px-4 py-2 text-sm font-semibold text-white shadow-md transition-colors hover:bg-emerald-500"
              >
                Join
              </Link>
            </>
          ) : (
            <button
              onClick={handleLogout}
              className="rounded-md border border-white/20 bg-white/5 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-white/10 hover:border-white/30"
            >
              Logout
            </button>
          )}
        </div>
      </nav>
    </header>
  )
}

export default Navbar
