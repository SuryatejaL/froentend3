import React, { useState, useEffect } from 'react'
import './App.css'
import { getCurrent, logout, seedData } from './utils'
import LoginRegister from './components/LoginRegister'
import PatientDashboard from './components/PatientDashboard'
import DoctorDashboard from './components/DoctorDashboard'
import PharmacistDashboard from './components/PharmacistDashboard'
import AdminDashboard from './components/AdminDashboard'

function App() {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    seedData()
    const current = getCurrent()
    setUser(current)
    setLoading(false)
  }, [])

  const handleLogin = (loggedInUser) => {
    setUser(loggedInUser)
  }

  const handleLogout = () => {
    logout()
    setUser(null)
  }

  if (loading) {
    return <div style={{ textAlign: 'center', padding: '40px' }}>Loading...</div>
  }

  // Show appropriate dashboard based on user role
  if (!user) {
    return <LoginRegister onLogin={handleLogin} />
  }

  if (user.role === 'patient') {
    return <PatientDashboard user={user} onLogout={handleLogout} />
  } else if (user.role === 'doctor') {
    return <DoctorDashboard user={user} onLogout={handleLogout} />
  } else if (user.role === 'pharmacist') {
    return <PharmacistDashboard user={user} onLogout={handleLogout} />
  } else if (user.role === 'admin') {
    return <AdminDashboard user={user} onLogout={handleLogout} />
  }

  return <div>Unknown role</div>
}

export default App
