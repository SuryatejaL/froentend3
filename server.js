const express = require('express')
const cors = require('cors')
const fs = require('fs')
const path = require('path')

const app = express()
const PORT = 5000
const DATA_DIR = path.join(__dirname, 'data')
const USERS_FILE = path.join(DATA_DIR, 'users.json')
const APPTS_FILE = path.join(DATA_DIR, 'appointments.json')
const PRESC_FILE = path.join(DATA_DIR, 'prescriptions.json')

// Middleware
app.use(cors())
app.use(express.json())

// Ensure data directory exists
if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true })
}

// Initialize data files if they don't exist
const initDataFiles = () => {
  if (!fs.existsSync(USERS_FILE)) {
    fs.writeFileSync(USERS_FILE, JSON.stringify([], null, 2))
  }
  if (!fs.existsSync(APPTS_FILE)) {
    fs.writeFileSync(APPTS_FILE, JSON.stringify([], null, 2))
  }
  if (!fs.existsSync(PRESC_FILE)) {
    fs.writeFileSync(PRESC_FILE, JSON.stringify([], null, 2))
  }
}

// Helper functions to read/write JSON files
const readFile = (filePath) => {
  try {
    return JSON.parse(fs.readFileSync(filePath, 'utf8'))
  } catch (err) {
    return []
  }
}

const writeFile = (filePath, data) => {
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2))
}

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'API running on port 5000' })
})

// ============ USERS ROUTES ============

// Get all users
app.get('/api/users', (req, res) => {
  const users = readFile(USERS_FILE)
  res.json(users)
})

// Get user by email
app.get('/api/users/email/:email', (req, res) => {
  const users = readFile(USERS_FILE)
  const user = users.find(u => u.email === req.params.email)
  if (!user) return res.status(404).json({ error: 'User not found' })
  res.json(user)
})

// Create user
app.post('/api/users', (req, res) => {
  const users = readFile(USERS_FILE)
  const { name, email, password, role } = req.body

  if (!name || !email || !password || !role) {
    return res.status(400).json({ error: 'Missing required fields' })
  }

  if (users.find(u => u.email === email)) {
    return res.status(400).json({ error: 'Email already exists' })
  }

  const newUser = {
    id: 'user_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9),
    name,
    email,
    password,
    role
  }

  users.push(newUser)
  writeFile(USERS_FILE, users)
  res.status(201).json(newUser)
})

// Delete user
app.delete('/api/users/:id', (req, res) => {
  let users = readFile(USERS_FILE)
  let appts = readFile(APPTS_FILE)
  let prescs = readFile(PRESC_FILE)

  users = users.filter(u => u.id !== req.params.id)
  appts = appts.filter(a => a.patientId !== req.params.id && a.doctorId !== req.params.id)
  prescs = prescs.filter(p => appts.find(a => a.id === p.apptId))

  writeFile(USERS_FILE, users)
  writeFile(APPTS_FILE, appts)
  writeFile(PRESC_FILE, prescs)

  res.json({ message: 'User deleted' })
})

// ============ APPOINTMENTS ROUTES ============

// Get all appointments
app.get('/api/appointments', (req, res) => {
  const appts = readFile(APPTS_FILE)
  res.json(appts)
})

// Create appointment
app.post('/api/appointments', (req, res) => {
  const appts = readFile(APPTS_FILE)
  const { patientId, doctorId, datetime, reason } = req.body

  if (!patientId || !doctorId || !datetime || !reason) {
    return res.status(400).json({ error: 'Missing required fields' })
  }

  const newAppt = {
    id: 'appt_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9),
    patientId,
    doctorId,
    datetime,
    reason,
    status: 'pending',
    paid: true,
    videoLink: null,
    prescriptionId: null,
    rejectionReason: '',
    createdAt: Date.now()
  }

  appts.push(newAppt)
  writeFile(APPTS_FILE, appts)
  res.status(201).json(newAppt)
})

// Update appointment
app.put('/api/appointments/:id', (req, res) => {
  const appts = readFile(APPTS_FILE)
  const appt = appts.find(a => a.id === req.params.id)

  if (!appt) return res.status(404).json({ error: 'Appointment not found' })

  Object.assign(appt, req.body)
  writeFile(APPTS_FILE, appts)
  res.json(appt)
})

// Delete appointment
app.delete('/api/appointments/:id', (req, res) => {
  let appts = readFile(APPTS_FILE)
  appts = appts.filter(a => a.id !== req.params.id)
  writeFile(APPTS_FILE, appts)
  res.json({ message: 'Appointment deleted' })
})

// ============ PRESCRIPTIONS ROUTES ============

// Get all prescriptions
app.get('/api/prescriptions', (req, res) => {
  const prescs = readFile(PRESC_FILE)
  res.json(prescs)
})

// Create prescription
app.post('/api/prescriptions', (req, res) => {
  const prescs = readFile(PRESC_FILE)
  const { apptId, text } = req.body

  if (!apptId || !text) {
    return res.status(400).json({ error: 'Missing required fields' })
  }

  const newPresc = {
    id: 'presc_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9),
    apptId,
    text,
    dispensed: false,
    available: true,
    createdAt: Date.now()
  }

  prescs.push(newPresc)
  writeFile(PRESC_FILE, prescs)
  res.status(201).json(newPresc)
})

// Update prescription
app.put('/api/prescriptions/:id', (req, res) => {
  const prescs = readFile(PRESC_FILE)
  const presc = prescs.find(p => p.id === req.params.id)

  if (!presc) return res.status(404).json({ error: 'Prescription not found' })

  Object.assign(presc, req.body)
  writeFile(PRESC_FILE, prescs)
  res.json(presc)
})

// Delete prescription
app.delete('/api/prescriptions/:id', (req, res) => {
  let prescs = readFile(PRESC_FILE)
  prescs = prescs.filter(p => p.id !== req.params.id)
  writeFile(PRESC_FILE, prescs)
  res.json({ message: 'Prescription deleted' })
})

// Initialize data files
initDataFiles()

// Start server
app.listen(PORT, () => {
  console.log(`\n🏥 Medical Consultation API Server running on http://localhost:${PORT}`)
  console.log(`📊 Data stored in: ${DATA_DIR}`)
  console.log(`Health check: http://localhost:${PORT}/health\n`)
})
