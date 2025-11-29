import React, { useState } from 'react'
import { load, setCurrentUser } from '../utils'
import { Constants } from '../utils'

function PharmacistLogin({ onLoginSuccess, onSwitchRole }) {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  const handleLogin = () => {
    if (!email || !password) {
      alert('Please fill email and password')
      return
    }
    const user = load(Constants.DB_USERS_KEY).find(
      u => u.email === email && u.password === password && u.role === 'pharmacist'
    )
    if (!user) {
      alert('Invalid email or password')
      return
    }
    setCurrentUser(user)
    onLoginSuccess(user)
  }

  return (
    <div style={{ background: '#f4f6f8', minHeight: '100vh', display: 'flex', alignItems: 'center' }}>
      <div style={{ width: '100%', maxWidth: '400px', margin: '0 auto', padding: '20px' }}>
        <div className="card" style={{ textAlign: 'center' }}>
          <div style={{ fontSize: '48px', marginBottom: '20px' }}>💊</div>
          <h2>Pharmacist Login</h2>
          <p className="muted">Manage prescriptions and medications</p>

          <div className="form-group">
            <label style={{ textAlign: 'left' }}>Email</label>
            <input
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleLogin()}
            />
          </div>

          <div className="form-group">
            <label style={{ textAlign: 'left' }}>Password</label>
            <input
              type="password"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleLogin()}
            />
          </div>

          <button onClick={handleLogin} style={{ width: '100%', marginTop: '20px' }}>Login as Pharmacist</button>

          <div style={{ marginTop: '20px', paddingTop: '20px', borderTop: '1px solid #eee' }}>
            <p className="muted" style={{ fontSize: '12px' }}>Demo: john@medf.test / pharmacist</p>
            <button
              onClick={() => onSwitchRole('choice')}
              style={{ width: '100%', background: '#6c757d', marginTop: '10px' }}
            >
              ← Back to Role Selection
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default PharmacistLogin
