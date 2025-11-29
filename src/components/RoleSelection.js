import React from 'react'

function RoleSelection({ onSelectRole }) {
  return (
    <div style={{ background: '#f4f6f8', minHeight: '100vh', display: 'flex', alignItems: 'center' }}>
      <div style={{ width: '100%' }}>
        <div style={{ textAlign: 'center', marginBottom: '40px' }}>
          <h1 style={{ fontSize: '36px', color: '#0b5ed7', margin: '0 0 10px 0' }}>MEDF-PS20</h1>
          <p style={{ color: '#6b7280', margin: 0 }}>Medical Consultation Platform</p>
        </div>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
          gap: '20px',
          maxWidth: '1000px',
          margin: '0 auto',
          padding: '20px'
        }}>
          {/* Patient */}
          <div
            onClick={() => onSelectRole('patient')}
            style={{
              background: 'white',
              border: '2px solid #e3f2fd',
              borderRadius: '10px',
              padding: '30px',
              textAlign: 'center',
              cursor: 'pointer',
              transition: 'all 0.3s ease',
              boxShadow: '0 2px 6px rgba(0,0,0,0.08)'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.borderColor = '#1976d2'
              e.currentTarget.style.boxShadow = '0 4px 12px rgba(25,118,210,0.2)'
              e.currentTarget.style.transform = 'translateY(-5px)'
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.borderColor = '#e3f2fd'
              e.currentTarget.style.boxShadow = '0 2px 6px rgba(0,0,0,0.08)'
              e.currentTarget.style.transform = 'translateY(0)'
            }}
          >
            <div style={{ fontSize: '48px', marginBottom: '15px' }}>🏥</div>
            <h3 style={{ margin: '0 0 10px 0', color: '#1976d2' }}>Patient</h3>
            <p style={{ color: '#6b7280', margin: 0, fontSize: '14px' }}>Book and manage appointments</p>
          </div>

          {/* Doctor */}
          <div
            onClick={() => onSelectRole('doctor')}
            style={{
              background: 'white',
              border: '2px solid #f3e5f5',
              borderRadius: '10px',
              padding: '30px',
              textAlign: 'center',
              cursor: 'pointer',
              transition: 'all 0.3s ease',
              boxShadow: '0 2px 6px rgba(0,0,0,0.08)'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.borderColor = '#7b1fa2'
              e.currentTarget.style.boxShadow = '0 4px 12px rgba(123,31,162,0.2)'
              e.currentTarget.style.transform = 'translateY(-5px)'
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.borderColor = '#f3e5f5'
              e.currentTarget.style.boxShadow = '0 2px 6px rgba(0,0,0,0.08)'
              e.currentTarget.style.transform = 'translateY(0)'
            }}
          >
            <div style={{ fontSize: '48px', marginBottom: '15px' }}>👨‍⚕️</div>
            <h3 style={{ margin: '0 0 10px 0', color: '#7b1fa2' }}>Doctor</h3>
            <p style={{ color: '#6b7280', margin: 0, fontSize: '14px' }}>Manage appointments and prescriptions</p>
          </div>

          {/* Pharmacist */}
          <div
            onClick={() => onSelectRole('pharmacist')}
            style={{
              background: 'white',
              border: '2px solid #e8f5e9',
              borderRadius: '10px',
              padding: '30px',
              textAlign: 'center',
              cursor: 'pointer',
              transition: 'all 0.3s ease',
              boxShadow: '0 2px 6px rgba(0,0,0,0.08)'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.borderColor = '#388e3c'
              e.currentTarget.style.boxShadow = '0 4px 12px rgba(56,142,60,0.2)'
              e.currentTarget.style.transform = 'translateY(-5px)'
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.borderColor = '#e8f5e9'
              e.currentTarget.style.boxShadow = '0 2px 6px rgba(0,0,0,0.08)'
              e.currentTarget.style.transform = 'translateY(0)'
            }}
          >
            <div style={{ fontSize: '48px', marginBottom: '15px' }}>💊</div>
            <h3 style={{ margin: '0 0 10px 0', color: '#388e3c' }}>Pharmacist</h3>
            <p style={{ color: '#6b7280', margin: 0, fontSize: '14px' }}>Manage prescriptions and medications</p>
          </div>

          {/* Admin */}
          <div
            onClick={() => onSelectRole('admin')}
            style={{
              background: 'white',
              border: '2px solid #fff3e0',
              borderRadius: '10px',
              padding: '30px',
              textAlign: 'center',
              cursor: 'pointer',
              transition: 'all 0.3s ease',
              boxShadow: '0 2px 6px rgba(0,0,0,0.08)'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.borderColor = '#e65100'
              e.currentTarget.style.boxShadow = '0 4px 12px rgba(230,81,0,0.2)'
              e.currentTarget.style.transform = 'translateY(-5px)'
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.borderColor = '#fff3e0'
              e.currentTarget.style.boxShadow = '0 2px 6px rgba(0,0,0,0.08)'
              e.currentTarget.style.transform = 'translateY(0)'
            }}
          >
            <div style={{ fontSize: '48px', marginBottom: '15px' }}>🔐</div>
            <h3 style={{ margin: '0 0 10px 0', color: '#e65100' }}>Admin</h3>
            <p style={{ color: '#6b7280', margin: 0, fontSize: '14px' }}>System administration and management</p>
          </div>

          {/* Registration */}
          <div
            onClick={() => onSelectRole('register')}
            style={{
              background: 'white',
              border: '2px dashed #28a745',
              borderRadius: '10px',
              padding: '30px',
              textAlign: 'center',
              cursor: 'pointer',
              transition: 'all 0.3s ease',
              boxShadow: '0 2px 6px rgba(0,0,0,0.08)'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.borderColor = '#20c997'
              e.currentTarget.style.boxShadow = '0 4px 12px rgba(40,167,69,0.2)'
              e.currentTarget.style.transform = 'translateY(-5px)'
              e.currentTarget.style.background = '#f0f9f7'
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.borderColor = '#28a745'
              e.currentTarget.style.boxShadow = '0 2px 6px rgba(0,0,0,0.08)'
              e.currentTarget.style.transform = 'translateY(0)'
              e.currentTarget.style.background = 'white'
            }}
          >
            <div style={{ fontSize: '48px', marginBottom: '15px' }}>✨</div>
            <h3 style={{ margin: '0 0 10px 0', color: '#28a745' }}>Create Account</h3>
            <p style={{ color: '#6b7280', margin: 0, fontSize: '14px' }}>Don't have an account? Register here</p>
          </div>
        </div>

        <div style={{ textAlign: 'center', marginTop: '40px', color: '#6b7280', fontSize: '14px' }}>
          <p>Select your role to login or create a new account</p>
        </div>
      </div>
    </div>
  )
}

export default RoleSelection
