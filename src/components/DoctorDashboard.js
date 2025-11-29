import React, { useState, useEffect } from 'react'
import { load, save, uid } from '../utils'
import { Constants } from '../utils'

function DoctorDashboard({ user, onLogout }) {
  const [pendingAppts, setPendingAppts] = useState([])
  const [historyAppts, setHistoryAppts] = useState([])

  useEffect(() => {
    loadAppointments()
  }, [])

    const loadAppointments = () => {
    const allAppts = load(Constants.DB_APPTS_KEY)
    const pending = allAppts.filter(a => a.doctorId === user.id && a.status === 'pending')
    // include rejected appointments in history so doctor can see them
    const history = allAppts.filter(a => a.doctorId === user.id && (a.status === 'approved' || a.status === 'completed' || a.status === 'rejected'))
    setPendingAppts(pending)
    setHistoryAppts(history)
  }

  const handleApproveAndSend = (apptId) => {
    const appts = load(Constants.DB_APPTS_KEY)
    const appt = appts.find(x => x.id === apptId)
    if (!appt) return alert('Not found')
    appt.status = 'approved'
    appt.videoLink = 'https://meet.example.com/' + uid()
    save(Constants.DB_APPTS_KEY, appts)
    alert('Approved! Video link: ' + appt.videoLink)
    loadAppointments()
  }

  const handleReject = (apptId) => {
    const reason = prompt('Enter rejection reason (optional):')
    const appts = load(Constants.DB_APPTS_KEY)
    const appt = appts.find(x => x.id === apptId)
    if (!appt) return alert('Not found')
    appt.status = 'rejected'
    appt.rejectionReason = reason || ''
    save(Constants.DB_APPTS_KEY, appts)
    alert('Appointment rejected' + (reason ? ': ' + reason : ''))
    loadAppointments()
  }

  const handleWritePrescription = (apptId) => {
    const text = prompt('Enter prescription text (medications, dosages, instructions):')
    if (!text) return

    const prescs = load(Constants.DB_PRESC_KEY)
    const prescId = uid()
    prescs.push({
      id: prescId,
      apptId,
      text,
      createdAt: Date.now(),
      dispensed: false,
      available: true
    })
    save(Constants.DB_PRESC_KEY, prescs)

    const appts = load(Constants.DB_APPTS_KEY)
    const appt = appts.find(x => x.id === apptId)
    if (appt) {
      appt.prescriptionId = prescId
      save(Constants.DB_APPTS_KEY, appts)
    }
    alert('Prescription saved!')
    loadAppointments()
  }

  const handleMarkCompleted = (apptId) => {
    const appts = load(Constants.DB_APPTS_KEY)
    const appt = appts.find(x => x.id === apptId)
    if (!appt) return
    appt.status = 'completed'
    save(Constants.DB_APPTS_KEY, appts)
    alert('Appointment marked as completed')
    loadAppointments()
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
        <h1 style={{ margin: 0, fontSize: '18px' }}>Doctor Dashboard</h1>
        <div>
          <strong>{user.name}</strong>&nbsp;&nbsp;
          <button className="logout" onClick={onLogout}>Logout</button>
        </div>
      </header>

      <main style={{ padding: '18px', maxWidth: '1100px', margin: '18px auto' }}>
        <div className="card">
          <h3>⏳ Pending Appointments</h3>
          {pendingAppts.length === 0 ? (
            <p className="muted">No pending appointments</p>
          ) : (
            pendingAppts.map(a => {
              const patient = load(Constants.DB_USERS_KEY).find(u => u.id === a.patientId)
              return (
                <div key={a.id} style={{
                  background: '#f8f9fa',
                  borderLeft: '4px solid #0b5ed7',
                  padding: '12px',
                  margin: '10px 0',
                  borderRadius: '6px',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'flex-start'
                }}>
                  <div style={{ flex: 1 }}>
                    <strong>{patient ? patient.name : '(patient)'}</strong>
                    <p className="muted" style={{ margin: '4px 0' }}>
                      {new Date(a.datetime).toLocaleString()}
                    </p>
                    <p style={{ margin: '8px 0' }}>
                      <strong>Reason:</strong> {a.reason}
                    </p>
                    <span className="badge badge-pending">Pending Approval</span>
                  </div>
                  <div>
                    <button onClick={() => handleApproveAndSend(a.id)}>✓ Approve & Send Link</button>
                    <button onClick={() => handleReject(a.id)} style={{ background: '#dc3545', marginTop: '8px' }}>✕ Reject</button>
                  </div>
                </div>
              )
            })
          )}
        </div>

        <div className="card">
          <h3>✅ Approved / Completed Appointments</h3>
          {historyAppts.length === 0 ? (
            <p className="muted">No approved/completed/rejected appointments</p>
          ) : (
            historyAppts.map(a => {
              const patient = load(Constants.DB_USERS_KEY).find(u => u.id === a.patientId)
              let badgeClass = ''
              if (a.status === 'approved') badgeClass = 'badge-approved'
              else if (a.status === 'completed') badgeClass = 'badge-completed'
              else if (a.status === 'rejected') badgeClass = 'badge-rejected'
              return (
                <div key={a.id} style={{
                  background: '#f8f9fa',
                  borderLeft: '4px solid #0b5ed7',
                  padding: '12px',
                  margin: '10px 0',
                  borderRadius: '6px',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'flex-start'
                }}>
                  <div style={{ flex: 1 }}>
                    <strong>{patient ? patient.name : '(patient)'}</strong>
                    <p className="muted" style={{ margin: '4px 0' }}>
                      {new Date(a.datetime).toLocaleString()}
                    </p>
                    <p style={{ margin: '8px 0' }}>
                      <strong>Reason:</strong> {a.reason}
                    </p>
                    <span className={`badge ${badgeClass}`}>{a.status}</span>
                    {a.videoLink && (
                      <p style={{ margin: '8px 0' }}>
                        <a href={a.videoLink} target="_blank" rel="noopener noreferrer" style={{ color: '#0b5ed7' }}>
                          📹 Video Call Link
                        </a>
                      </p>
                    )}
                    {a.prescriptionId && (() => {
                      const presc = load(Constants.DB_PRESC_KEY).find(x => x.id === a.prescriptionId)
                      if (!presc) return null
                      if (presc.available === false) {
                        return <p style={{ marginTop: '8px', color: '#9b1c1c' }}>💊 Prescription currently not available</p>
                      }
                      return null
                    })()}
                    {a.status === 'rejected' && a.rejectionReason && (
                      <p style={{ marginTop: '8px', color: '#9b1c1c' }}><strong>Rejection reason:</strong> {a.rejectionReason}</p>
                    )}
                  </div>
                  <div>
                    <button onClick={() => handleWritePrescription(a.id)}>📝 Prescription</button>
                    {a.status !== 'completed' && a.status !== 'rejected' && (
                      <button onClick={() => handleMarkCompleted(a.id)} style={{ background: '#28a745' }}>✓ Complete</button>
                    )}
                  </div>
                </div>
              )
            })
          )}
        </div>
      </main>
    </div>
  )
}

export default DoctorDashboard
