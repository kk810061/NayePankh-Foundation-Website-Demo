import { Navigate, Route, Routes } from 'react-router-dom'
import Navbar from './components/Navbar.jsx'
import ProtectedRoute from './components/ProtectedRoute.jsx'
import AdminDashboard from './pages/AdminDashboard.jsx'
import Home from './pages/Home.jsx'
import Login from './pages/Login.jsx'
import Programs from './pages/Programs.jsx'
import Register from './pages/Register.jsx'
import VolunteerDashboard from './pages/VolunteerDashboard.jsx'

function App() {
  return (
    <div 
      className="min-h-screen bg-slate-950 text-stone-200 bg-cover bg-center bg-fixed bg-no-repeat"
      style={{ backgroundImage: "url('/bg.png')" }}
    >
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/programs" element={<Programs />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route
          path="/volunteer/dashboard"
          element={
            <ProtectedRoute>
              <VolunteerDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/dashboard"
          element={
            <ProtectedRoute allowedRole="Admin">
              <AdminDashboard />
            </ProtectedRoute>
          }
        />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </div>
  )
}

export default App
