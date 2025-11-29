import React, { useState, useEffect } from 'react'
import { load, save, uid } from '../utils'
import { Constants } from '../utils'

function PatientDashboard({ user, onLogout }) {
  const [doctors, setDoctors] = useState([])
  const [appointments, setAppointments] = useState([])
  const [selectedDoctor, setSelectedDoctor] = useState('')
  const [apptDate, setApptDate] = useState('')
  const [apptReason, setApptReason] = useState('')

  useEffect(() => {
    loadDoctors()
    loadAppointments()
  }, [])

  const loadDoctors = () => {
    const docsList = load(Constants.DB_USERS_KEY).filter(u => u.role === 'doctor')
    setDoctors(docsList)
    if (docsList.length > 0) {
      setSelectedDoctor(docsList[0].id)
    }
  }

  const loadAppointments = () => {
    const appts = load(Constants.DB_APPTS_KEY).filter(a => a.patientId === user.id)
    setAppointments(appts)
  }

  const handleBookAppointment = () => {
    if (!selectedDoctor || !apptDate || !apptReason) {
      alert('Please fill all fields')
      return
    }
    // Validate that appointment date is in the future
    const selectedDateTime = new Date(apptDate)
    const now = new Date()
    if (selectedDateTime <= now) {
      alert('Please select a future date and time for your appointment')
      return
    }
    // eslint-disable-next-line no-restricted-globals
    const shouldProceed = window.confirm('Simulate payment of ₹500 and complete booking?')
    if (!shouldProceed) return

    const appts = load(Constants.DB_APPTS_KEY)
    const newAppt = {
      id: uid(),
      patientId: user.id,
      doctorId: selectedDoctor,
      datetime: apptDate,
      reason: apptReason,
      status: 'pending',
      paid: true,
      videoLink: null,
      prescriptionId: null,
      createdAt: Date.now()
    }
    appts.push(newAppt)
    save(Constants.DB_APPTS_KEY, appts)
    alert('Appointment booked successfully!')
    setApptDate('')
    setApptReason('')
    loadAppointments()
  }

  // Get minimum datetime (current date and time) for datetime input
  const getMinDateTime = () => {
    const now = new Date()
    const year = now.getFullYear()
    const month = String(now.getMonth() + 1).padStart(2, '0')
    const day = String(now.getDate()).padStart(2, '0')
    const hours = String(now.getHours()).padStart(2, '0')
    const minutes = String(now.getMinutes()).padStart(2, '0')
    return `${year}-${month}-${day}T${hours}:${minutes}`
  }

  const viewPrescription = (prescId) => {
    const p = load(Constants.DB_PRESC_KEY).find(x => x.id === prescId)
    if (!p) return alert('Prescription not found')
    if (p.available === false) return alert('Prescription currently not available')
    alert('Prescription:\n\n' + p.text)
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
        <h1 style={{ margin: 0, fontSize: '18px' }}>Patient Dashboard</h1>
        <div>
          <strong>{user.name}</strong>&nbsp;&nbsp;
          <button className="logout" onClick={onLogout}>Logout</button>
        </div>
      </header>

      <main style={{ padding: '18px', maxWidth: '1100px', margin: '18px auto' }}>
        <div className="card">
          <h3>Book Appointment</h3>
          <div className="row">
            <div>
              <div className="form-group">
                <label>Choose Doctor</label>
                <select value={selectedDoctor} onChange={(e) => setSelectedDoctor(e.target.value)}>
                  {doctors.map(d => (
                    <option key={d.id} value={d.id}>
                      {d.name} ({d.email})
                    </option>
                  ))}
                </select>
              </div>
              <div className="form-group">
                <label>Date & Time</label>
                <input
                  type="datetime-local"
                  value={apptDate}
                  min={getMinDateTime()}
                  onChange={(e) => setApptDate(e.target.value)}
                />
                <p style={{ fontSize: '12px', color: '#6b7280', margin: '4px 0' }}>Only future dates are allowed</p>
              </div>
              <div className="form-group">
                <label>Reason for Appointment</label>
                <textarea
                  rows="3"
                  placeholder="Describe your symptoms or concerns"
                  value={apptReason}
                  onChange={(e) => setApptReason(e.target.value)}
                />
              </div>
              <button onClick={handleBookAppointment}>Proceed to Payment & Book</button>
            </div>
          </div>
        </div>

        <div className="card">
          <h3>My Appointments</h3>
          {appointments.length === 0 ? (
            <p className="muted">No appointments yet</p>
          ) : (
            <table>
              <thead>
                <tr>
                  <th>Doctor</th>
                  <th>Date & Time</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {appointments.map(a => {
                  const doc = load(Constants.DB_USERS_KEY).find(u => u.id === a.doctorId)
                  return (
                    <tr key={a.id}>
                      <td>{doc ? doc.name : '(deleted)'}</td>
                      <td>{new Date(a.datetime).toLocaleString()}</td>
                      <td><strong>{a.status}</strong></td>
                      <td>
                        {a.videoLink && (
                          <a href={a.videoLink} target="_blank" rel="noopener noreferrer" style={{ color: '#0b5ed7', textDecoration: 'none' }}>
                            📹 Join Call
                          </a>
                        )}
                        {a.prescriptionId && (() => {
                          const p = load(Constants.DB_PRESC_KEY).find(x => x.id === a.prescriptionId)
                          if (!p) return <button onClick={() => viewPrescription(a.prescriptionId)}>📋 View Rx</button>
                          if (p.available === false) return <span style={{ color: '#9b1c1c' }}>💊 Currently not available</span>
                          return <button onClick={() => viewPrescription(a.prescriptionId)}>📋 View Rx</button>
                        })()}
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          )}
        </div>
      </main>
    </div>
  )
}

export default PatientDashboard
