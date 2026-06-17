import { useState } from 'react'
import api from '../api/axios.js'
import { AuthContext } from './auth.js'

export function AuthProvider({ children }) {
  const savedUser = localStorage.getItem('user')
  const [user, setUser] = useState(savedUser ? JSON.parse(savedUser) : null)

  async function login(formData) {
    const response = await api.post('/auth/login', formData)
    saveAuth(response.data)
    return response.data.user
  }

  async function register(formData) {
    const response = await api.post('/auth/register', formData)
    saveAuth(response.data)
    return response.data.user
  }

  function saveAuth(data) {
    localStorage.setItem('token', data.token)
    localStorage.setItem('user', JSON.stringify(data.user))
    setUser(data.user)
  }

  function logout() {
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    setUser(null)
  }

  return (
    <AuthContext.Provider value={{ user, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  )
}
