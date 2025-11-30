import React, { useState } from 'react'
import { uid, findUserByEmail, saveUser, Constants } from '../utils-api'
import RoleSelection from './RoleSelection'
import PatientLogin from './PatientLogin'
import DoctorLogin from './DoctorLogin'
import AdminLogin from './AdminLogin'
import PharmacistLogin from './PharmacistLogin'

function LoginRegister({ onLogin }) {
  const [currentView, setCurrentView] = useState('choice') // 'choice', 'patient', 'doctor', 'admin', 'pharmacist', 'register'
  const [regName, setRegName] = useState('')
  const [regEmail, setRegEmail] = useState('')
  const [regPassword, setRegPassword] = useState('')
  const [regRole, setRegRole] = useState('patient')

  // Password validation: must have uppercase, lowercase, number, and special character
  const isPasswordValid = (pwd) => {
    return /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])/.test(pwd) && pwd.length >= 8
  }

  // Email validation
  const isEmailValid = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return emailRegex.test(email)
  }

  const getPasswordErrors = (pwd) => {
    const errors = []
    if (pwd.length < 8) errors.push('At least 8 characters')
    if (!/(?=.*[a-z])/.test(pwd)) errors.push('One lowercase letter')
    if (!/(?=.*[A-Z])/.test(pwd)) errors.push('One uppercase letter')
    if (!/(?=.*\d)/.test(pwd)) errors.push('One number')
    if (!/(?=.*[@$!%*?&])/.test(pwd)) errors.push('One special character (@$!%*?&)')
    return errors
  }

  // Get validation status for each field
  const getFieldValidation = () => {
    const validation = {}
    validation.name = regName.length > 0 && /^[a-zA-Z\s]+$/.test(regName)
    validation.email = regEmail.length > 0 && isEmailValid(regEmail)
    validation.password = regPassword.length > 0 && isPasswordValid(regPassword)
    return validation
  }

  const getFieldErrors = () => {
    const errors = []
    if (!regName) errors.push('Name is required')
    else if (!/^[a-zA-Z\s]+$/.test(regName)) errors.push('Name: Only letters and spaces allowed')
    if (!regEmail) errors.push('Email is required')
    else if (!isEmailValid(regEmail)) errors.push('Email: Invalid format (e.g., example@domain.com)')
    if (!regPassword) errors.push('Password is required')
    else if (!isPasswordValid(regPassword)) {
      const pwdErrors = getPasswordErrors(regPassword)
      errors.push(`Password: Missing - ${pwdErrors.join(', ')}`)
    }
    return errors
  }

  const handleSelectRole = (role) => {
    if (role === 'register') {
      setCurrentView('register')
    } else {
      setCurrentView(role)
    }
  }

  const handleRegister = async () => {
    if (!regName || !regEmail || !regPassword) {
      alert('Please fill all fields')
      return
    }
    // Validate name: only letters and spaces
    if (!/^[a-zA-Z\s]+$/.test(regName)) {
      alert('Name must contain only letters and spaces (no numbers or special characters)')
      return
    }
    // Validate email format
    if (!isEmailValid(regEmail)) {
      alert('Please enter a valid email address (e.g., example@domain.com)')
      return
    }
    // Validate password strength
    if (!isPasswordValid(regPassword)) {
      const errors = getPasswordErrors(regPassword)
      alert('Password must contain:\n- At least 8 characters\n- One uppercase letter (A-Z)\n- One lowercase letter (a-z)\n- One number (0-9)\n- One special character (@$!%*?&)')
      return
    }
    const existing = await findUserByEmail(regEmail)
    if (existing) {
      alert('User with this email already exists')
      return
    }

    const newUser = {
      id: uid(),
      name: regName,
      email: regEmail,
      password: regPassword,
      role: regRole
    }

    const saved = await saveUser(newUser)
    if (!saved) {
      alert('Registration failed — please try again later')
      return
    }

    alert('Registration successful! You can now login.')
    setRegName('')
    setRegEmail('')
    setRegPassword('')
    setRegRole('patient')
    setCurrentView('choice')
  }

  // Role selection view
  if (currentView === 'choice') {
    return <RoleSelection onSelectRole={handleSelectRole} />
  }

  // Patient login
  if (currentView === 'patient') {
    return <PatientLogin onLoginSuccess={onLogin} onSwitchRole={setCurrentView} />
  }

  // Doctor login
  if (currentView === 'doctor') {
    return <DoctorLogin onLoginSuccess={onLogin} onSwitchRole={setCurrentView} />
  }

  // Admin login
  if (currentView === 'admin') {
    return <AdminLogin onLoginSuccess={onLogin} onSwitchRole={setCurrentView} />
  }

  // Pharmacist login
  if (currentView === 'pharmacist') {
    return <PharmacistLogin onLoginSuccess={onLogin} onSwitchRole={setCurrentView} />
  }

  // Register view
  return (
    <div style={{ background: '#f4f6f8', minHeight: '100vh', display: 'flex', alignItems: 'center' }}>
      <div style={{ width: '100%', maxWidth: '500px', margin: '0 auto', padding: '20px' }}>
        <div className="card">
          <div style={{ textAlign: 'center', marginBottom: '20px' }}>
            <div style={{ fontSize: '40px', marginBottom: '10px' }}>✨</div>
            <h2>Create New Account</h2>
            <p className="muted">Join the medical consultation platform</p>
          </div>

          {getFieldErrors().length > 0 && (
            <div style={{
              background: '#fff3cd',
              border: '1px solid #ffc107',
              borderRadius: '6px',
              padding: '12px',
              marginBottom: '16px'
            }}>
              <p style={{ margin: '0 0 8px 0', fontWeight: '500', color: '#856404' }}>⚠️ Please fill in the required fields:</p>
              <ul style={{ margin: '0', paddingLeft: '20px', color: '#856404' }}>
                {getFieldErrors().map((error, idx) => (
                  <li key={idx} style={{ fontSize: '13px', margin: '4px 0' }}>{error}</li>
                ))}
              </ul>
            </div>
          )}

          <div className="form-group">
            <label style={{ textAlign: 'left' }}>Full Name *</label>
            <input
              placeholder="Enter your full name (letters and spaces only)"
              value={regName}
              onChange={(e) => {
                const filtered = e.target.value.replace(/[^a-zA-Z\s]/g, '')
                setRegName(filtered)
              }}
            />
            {regName && !/^[a-zA-Z\s]+$/.test(regName) && (
              <p style={{ color: '#dc3545', fontSize: '12px', margin: '4px 0' }}>Only letters and spaces allowed</p>
            )}
          </div>

          <div className="form-group">
            <label style={{ textAlign: 'left' }}>Email Address *</label>
            <input
              type="email"
              placeholder="Enter your email (e.g., example@domain.com)"
              value={regEmail}
              onChange={(e) => setRegEmail(e.target.value)}
            />
            {regEmail && (
              <p style={{ 
                color: isEmailValid(regEmail) ? '#28a745' : '#dc3545', 
                fontSize: '12px', 
                margin: '4px 0' 
              }}>
                {isEmailValid(regEmail) ? '✓ Valid email' : '✕ Invalid email format'}
              </p>
            )}
          </div>

          <div className="form-group">
            <label style={{ textAlign: 'left' }}>Password *</label>
            <input
              type="password"
              placeholder="Create a strong password (min 8 chars)"
              value={regPassword}
              onChange={(e) => setRegPassword(e.target.value)}
            />
            {regPassword && (
              <div style={{ marginTop: '8px', fontSize: '12px' }}>
                {getPasswordErrors(regPassword).length === 0 ? (
                  <p style={{ color: '#28a745', margin: '4px 0' }}>✓ Password is strong</p>
                ) : (
                  <div style={{ color: '#dc3545' }}>
                    <p style={{ margin: '4px 0', fontWeight: '500' }}>Password must contain:</p>
                    <ul style={{ margin: '4px 0', paddingLeft: '20px' }}>
                      <li style={{ color: /(?=.*[a-z])/.test(regPassword) ? '#28a745' : '#dc3545' }}>Lowercase letter (a-z)</li>
                      <li style={{ color: /(?=.*[A-Z])/.test(regPassword) ? '#28a745' : '#dc3545' }}>Uppercase letter (A-Z)</li>
                      <li style={{ color: /(?=.*\d)/.test(regPassword) ? '#28a745' : '#dc3545' }}>Number (0-9)</li>
                      <li style={{ color: /(?=.*[@$!%*?&])/.test(regPassword) ? '#28a745' : '#dc3545' }}>Special character (@$!%*?&)</li>
                      <li style={{ color: regPassword.length >= 8 ? '#28a745' : '#dc3545' }}>At least 8 characters</li>
                    </ul>
                  </div>
                )}
              </div>
            )}
          </div>

          <div className="form-group">
            <label style={{ textAlign: 'left' }}>Select Your Role *</label>
            <select value={regRole} onChange={(e) => setRegRole(e.target.value)}>
              <option value="patient">🏥 Patient - Book and manage appointments</option>
              <option value="doctor">👨‍⚕️ Doctor - Manage patient appointments</option>
              <option value="pharmacist">💊 Pharmacist - Manage prescriptions</option>
              <option value="admin">🔐 Admin - System administration</option>
            </select>
          </div>

          <button onClick={handleRegister} style={{ width: '100%', marginTop: '20px', background: '#28a745' }}>
            Create Account
          </button>

          <div style={{ marginTop: '20px', paddingTop: '20px', borderTop: '1px solid #eee', textAlign: 'center' }}>
            <p className="muted" style={{ fontSize: '12px', margin: '0 0 10px 0' }}>
              Already have an account?
            </p>
            <button
              onClick={() => setCurrentView('choice')}
              style={{ width: '100%', background: '#0b5ed7' }}
            >
              ← Back to Login
            </button>
          </div>

          <div style={{ marginTop: '15px', padding: '12px', background: '#e6f2ff', borderRadius: '6px' }}>
            <p className="muted" style={{ fontSize: '12px', margin: 0 }}>
              <strong>Demo accounts available:</strong> bob@medf.test (patient), alice@medf.test (doctor), john@medf.test (pharmacist), admin@medf.test (admin)
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default LoginRegister
