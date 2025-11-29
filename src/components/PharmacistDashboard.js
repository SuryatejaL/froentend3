import React, { useState, useEffect } from 'react'
import { load, save } from '../utils'
import { Constants } from '../utils'

function PharmacistDashboard({ user, onLogout }) {
  const [prescriptions, setPrescriptions] = useState([])

  useEffect(() => {
    loadPrescriptions()
  }, [])

  const loadPrescriptions = () => {
    const prescs = load(Constants.DB_PRESC_KEY)
    setPrescriptions(prescs)
  }

  const handleToggleDispensed = (prescId) => {
    const prescs = load(Constants.DB_PRESC_KEY)
    const presc = prescs.find(x => x.id === prescId)
    if (!presc) return
    if (presc.available === false && !presc.dispensed) {
      alert('Cannot mark dispensed: medicine is marked as unavailable')
      return
    }
    presc.dispensed = !presc.dispensed
    save(Constants.DB_PRESC_KEY, prescs)
    loadPrescriptions()
  }

  const handleMarkUnavailable = (prescId) => {
    const prescs = load(Constants.DB_PRESC_KEY)
    const presc = prescs.find(x => x.id === prescId)
    if (!presc) return
    presc.available = false
    presc.dispensed = false
    save(Constants.DB_PRESC_KEY, prescs)
    loadPrescriptions()
  }

  const handleMarkAvailable = (prescId) => {
    const prescs = load(Constants.DB_PRESC_KEY)
    const presc = prescs.find(x => x.id === prescId)
    if (!presc) return
    presc.available = true
    save(Constants.DB_PRESC_KEY, prescs)
    loadPrescriptions()
  }

  const pendingPrescs = prescriptions.filter(p => !p.dispensed)
  const dispensedPrescs = prescriptions.filter(p => p.dispensed)

  const renderPrescriptions = (prescs, isPending) => {
    return prescs.map(p => {
      const appt = load(Constants.DB_APPTS_KEY).find(a => a.id === p.apptId)
      const patient = appt ? load(Constants.DB_USERS_KEY).find(u => u.id === appt.patientId) : null
      const doctor = appt ? load(Constants.DB_USERS_KEY).find(u => u.id === appt.doctorId) : null

      return (
        <div key={p.id} style={{
          background: '#f8f9fa',
          borderLeft: '4px solid ' + (isPending ? '#17a2b8' : '#28a745'),
          padding: '12px',
          margin: '10px 0',
          borderRadius: '6px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'flex-start',
          opacity: isPending ? 1 : 0.8
        }}>
          <div style={{ flex: 1 }}>
            <strong>Patient:</strong> {patient ? patient.name : '(deleted)'}<br />
            <strong>Doctor:</strong> {doctor ? doctor.name : '(deleted)'}<br />
            <strong>Date:</strong> {new Date(p.createdAt).toLocaleDateString()}<br />
            <p style={{
              margin: '8px 0',
              padding: '8px',
              background: 'white',
              borderRadius: '4px',
              borderLeft: '3px solid ' + (isPending ? '#17a2b8' : '#28a745')
            }}>
              <strong>Rx:</strong><br />{p.text}
            </p>
              {p.available === false ? (
                <span className={'badge badge-rejected'}>Unavailable</span>
              ) : (
                <span className={isPending ? 'badge badge-pending' : 'badge badge-completed'}>
                  {isPending ? 'Pending' : 'Dispensed'}
                </span>
              )}
          </div>
          <div>
              <button
                onClick={() => handleToggleDispensed(p.id)}
                style={{ background: isPending ? '#28a745' : '#6c757d' }}
              >
                {isPending ? '✓ Mark Dispensed' : '↩️ Undo'}
              </button>
              {isPending && p.available !== false && (
                <button onClick={() => handleMarkUnavailable(p.id)} style={{ background: '#dc3545', marginTop: '8px' }}>✕ Mark Unavailable</button>
              )}
              {isPending && p.available === false && (
                <button onClick={() => handleMarkAvailable(p.id)} style={{ background: '#0b5ed7', marginTop: '8px' }}>✔️ Mark Available</button>
              )}
          </div>
        </div>
      )
    })
  }

  return (
    <div style={{ background: '#f4f6f8', minHeight: '100vh' }}>
      <header style={{
        background: '#0b5ed7',
        color: 'white',
        padding: '12px 20px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center'
      }}>
        <h1 style={{ margin: 0, fontSize: '18px' }}>Pharmacist Dashboard</h1>
        <div>
          <strong>{user.name}</strong>&nbsp;&nbsp;
          <button className="logout" onClick={onLogout}>Logout</button>
        </div>
      </header>

      <main style={{ padding: '18px', maxWidth: '1100px', margin: '18px auto' }}>
        <div className="card">
          <h3>💊 Prescriptions to Dispense</h3>
          {prescriptions.length === 0 ? (
            <p className="muted">No prescriptions available</p>
          ) : (
            <>
              {pendingPrescs.length > 0 && (
                <>
                  <h4 style={{ color: '#856404' }}>⏳ Pending Dispensing</h4>
                  {renderPrescriptions(pendingPrescs, true)}
                </>
              )}
              {dispensedPrescs.length > 0 && (
                <>
                  <h4 style={{ color: '#155724', marginTop: '20px' }}>✅ Dispensed</h4>
                  {renderPrescriptions(dispensedPrescs, false)}
                </>
              )}
            </>
          )}
        </div>
      </main>
    </div>
  )
}

export default PharmacistDashboard
