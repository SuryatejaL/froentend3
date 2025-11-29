// API utility functions for backend integration
const API_BASE_URL = 'http://localhost:5000/api'

const Constants = {
  DB_USERS_KEY: 'users',
  DB_APPTS_KEY: 'appointments',
  DB_PRESC_KEY: 'prescriptions'
}

// Generate unique ID
const uid = () => {
  return 'id_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9)
}

// ============ USER FUNCTIONS ============

const loadUsers = async () => {
  try {
    const res = await fetch(`${API_BASE_URL}/users`)
    if (!res.ok) throw new Error('Failed to fetch users')
    return await res.json()
  } catch (err) {
    console.error('Error loading users:', err)
    return []
  }
}

const saveUser = async (user) => {
  try {
    const res = await fetch(`${API_BASE_URL}/users`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(user)
    })
    if (!res.ok) throw new Error('Failed to save user')
    return await res.json()
  } catch (err) {
    console.error('Error saving user:', err)
    return null
  }
}

const findUserByEmail = async (email) => {
  try {
    const res = await fetch(`${API_BASE_URL}/users/email/${encodeURIComponent(email)}`)
    if (res.status === 404) return null
    if (!res.ok) throw new Error('Failed to find user')
    return await res.json()
  } catch (err) {
    console.error('Error finding user:', err)
    return null
  }
}

const deleteUser = async (userId) => {
  try {
    const res = await fetch(`${API_BASE_URL}/users/${userId}`, { method: 'DELETE' })
    if (!res.ok) throw new Error('Failed to delete user')
    return true
  } catch (err) {
    console.error('Error deleting user:', err)
    return false
  }
}

// ============ APPOINTMENT FUNCTIONS ============

const loadAppointments = async () => {
  try {
    const res = await fetch(`${API_BASE_URL}/appointments`)
    if (!res.ok) throw new Error('Failed to fetch appointments')
    return await res.json()
  } catch (err) {
    console.error('Error loading appointments:', err)
    return []
  }
}

const saveAppointment = async (appointment) => {
  try {
    const res = await fetch(`${API_BASE_URL}/appointments`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(appointment)
    })
    if (!res.ok) throw new Error('Failed to save appointment')
    return await res.json()
  } catch (err) {
    console.error('Error saving appointment:', err)
    return null
  }
}

const updateAppointment = async (appointmentId, updates) => {
  try {
    const res = await fetch(`${API_BASE_URL}/appointments/${appointmentId}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updates)
    })
    if (!res.ok) throw new Error('Failed to update appointment')
    return await res.json()
  } catch (err) {
    console.error('Error updating appointment:', err)
    return null
  }
}

const deleteAppointment = async (appointmentId) => {
  try {
    const res = await fetch(`${API_BASE_URL}/appointments/${appointmentId}`, { method: 'DELETE' })
    if (!res.ok) throw new Error('Failed to delete appointment')
    return true
  } catch (err) {
    console.error('Error deleting appointment:', err)
    return false
  }
}

// ============ PRESCRIPTION FUNCTIONS ============

const loadPrescriptions = async () => {
  try {
    const res = await fetch(`${API_BASE_URL}/prescriptions`)
    if (!res.ok) throw new Error('Failed to fetch prescriptions')
    return await res.json()
  } catch (err) {
    console.error('Error loading prescriptions:', err)
    return []
  }
}

const savePrescription = async (prescription) => {
  try {
    const res = await fetch(`${API_BASE_URL}/prescriptions`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(prescription)
    })
    if (!res.ok) throw new Error('Failed to save prescription')
    return await res.json()
  } catch (err) {
    console.error('Error saving prescription:', err)
    return null
  }
}

const updatePrescription = async (prescriptionId, updates) => {
  try {
    const res = await fetch(`${API_BASE_URL}/prescriptions/${prescriptionId}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updates)
    })
    if (!res.ok) throw new Error('Failed to update prescription')
    return await res.json()
  } catch (err) {
    console.error('Error updating prescription:', err)
    return null
  }
}

const deletePrescription = async (prescriptionId) => {
  try {
    const res = await fetch(`${API_BASE_URL}/prescriptions/${prescriptionId}`, { method: 'DELETE' })
    if (!res.ok) throw new Error('Failed to delete prescription')
    return true
  } catch (err) {
    console.error('Error deleting prescription:', err)
    return false
  }
}

// ============ SESSION MANAGEMENT ============

const getCurrent = () => {
  try {
    const current = sessionStorage.getItem('current_user')
    return current ? JSON.parse(current) : null
  } catch (err) {
    return null
  }
}

const setCurrentUser = (user) => {
  sessionStorage.setItem('current_user', JSON.stringify(user))
}

const logout = () => {
  sessionStorage.removeItem('current_user')
}

// ============ SEED DATA (for first-time setup) ============

const seedData = async () => {
  const users = await loadUsers()
  if (users.length > 0) return // Data already seeded

  const demoUsers = [
    { id: uid(), name: 'Bob Patient', email: 'bob@medf.test', password: 'Test@1234', role: 'patient' },
    { id: uid(), name: 'Alice Doctor', email: 'alice@medf.test', password: 'Test@1234', role: 'doctor' },
    { id: uid(), name: 'John Pharmacist', email: 'john@medf.test', password: 'Test@1234', role: 'pharmacist' },
    { id: uid(), name: 'Admin User', email: 'admin@medf.test', password: 'Test@1234', role: 'admin' }
  ]

  for (const user of demoUsers) {
    await saveUser(user)
  }

  console.log('✓ Demo data seeded successfully')
}

export {
  Constants,
  uid,
  loadUsers,
  saveUser,
  findUserByEmail,
  deleteUser,
  loadAppointments,
  saveAppointment,
  updateAppointment,
  deleteAppointment,
  loadPrescriptions,
  savePrescription,
  updatePrescription,
  deletePrescription,
  getCurrent,
  setCurrentUser,
  logout,
  seedData
}
