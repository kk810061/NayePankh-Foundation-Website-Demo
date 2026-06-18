import { Navigate } from 'react-router-dom'
import { useAuth } from '../context/auth.js'

function ProtectedRoute({ children, allowedRole }) {
  const { user } = useAuth()

  if (!user) {
    return <Navigate to="/login" state={{ message: 'You must be logged in to access this page.', type: 'error' }} replace />
  }

  if (allowedRole && user.role !== allowedRole) {
    return <Navigate to="/" replace />
  }

  return children
}

export default ProtectedRoute
