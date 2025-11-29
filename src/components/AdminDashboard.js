import React, { useState, useEffect } from 'react'
import { load, save } from '../utils'
import { Constants } from '../utils'

function AdminDashboard({ user, onLogout }) {
  const [users, setUsers] = useState([])
  const [appointments, setAppointments] = useState([])
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalAppts: 0,
    pendingAppts: 0,
    totalRx: 0
  })

  useEffect(() => {
    loadData()
  }, [])

  const loadData = () => {
    const usersList = load(Constants.DB_USERS_KEY)
    const apptsList = load(Constants.DB_APPTS_KEY)
    const prescsList = load(Constants.DB_PRESC_KEY)

    setUsers(usersList)
    setAppointments(apptsList)
    setStats({
      totalUsers: usersList.length,
      totalAppts: apptsList.length,
      pendingAppts: apptsList.filter(a => a.status === 'pending').length,
      totalRx: prescsList.length
    })
  }

  const handleDeleteUser = (userId) => {
    // eslint-disable-next-line no-restricted-globals
    if (!confirm('Delete this user? This will also remove all their appointments and related data.')) return

    let usersList = load(Constants.DB_USERS_KEY)
    usersList = usersList.filter(u => u.id !== userId)
    save(Constants.DB_USERS_KEY, usersList)

    let apptsList = load(Constants.DB_APPTS_KEY)
    apptsList = apptsList.filter(a => a.patientId !== userId && a.doctorId !== userId)
    save(Constants.DB_APPTS_KEY, apptsList)

    let prescsList = load(Constants.DB_PRESC_KEY)
    prescsList = prescsList.filter(p => {
      const appt = load(Constants.DB_APPTS_KEY).find(x => x.id === p.apptId)
      return !!appt
    })
    save(Constants.DB_PRESC_KEY, prescsList)

    alert('User deleted successfully')
    loadData()
  }

  const handleDeleteAppt = (apptId) => {
    // eslint-disable-next-line no-restricted-globals
    if (!confirm('Delete this appointment?')) return

    let apptsList = load(Constants.DB_APPTS_KEY)
    apptsList = apptsList.filter(a => a.id !== apptId)
    save(Constants.DB_APPTS_KEY, apptsList)

    alert('Appointment deleted')
    loadData()
  }

  const getRoleBadge = (role) => {
    const badges = {
      patient: 'badge-patient',
      doctor: 'badge-doctor',
      admin: 'badge-admin',
      pharmacist: 'badge-pharmacist'
    }
    return badges[role] || ''
  }

  const getStatusBadge = (status) => {
    const badges = {
      pending: 'badge-pending',
      approved: 'badge-approved',
      completed: 'badge-completed'
    }
    return badges[status] || ''
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
        <h1 style={{ margin: 0, fontSize: '18px' }}>Admin Dashboard</h1>
        <div>
          <button className="logout" onClick={onLogout}>Logout</button>
        </div>
      </header>

      <main style={{ padding: '18px', maxWidth: '1200px', margin: '18px auto' }}>
        <div className="card">
          <h3>📊 Overview</h3>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '10px', margin: '10px 0' }}>
            <div style={{
              background: '#f8f9fa',
              padding: '12px',
              borderRadius: '6px',
              borderLeft: '4px solid #0b5ed7',
              textAlign: 'center'
            }}>
              <h3 style={{ margin: 0, fontSize: '24px', color: '#0b5ed7' }}>{stats.totalUsers}</h3>
              <p style={{ margin: '4px 0', color: '#6b7280', fontSize: '12px' }}>Total Users</p>
            </div>
            <div style={{
              background: '#f8f9fa',
              padding: '12px',
              borderRadius: '6px',
              borderLeft: '4px solid #0b5ed7',
              textAlign: 'center'
            }}>
              <h3 style={{ margin: 0, fontSize: '24px', color: '#0b5ed7' }}>{stats.totalAppts}</h3>
              <p style={{ margin: '4px 0', color: '#6b7280', fontSize: '12px' }}>Total Appointments</p>
            </div>
            <div style={{
              background: '#f8f9fa',
              padding: '12px',
              borderRadius: '6px',
              borderLeft: '4px solid #0b5ed7',
              textAlign: 'center'
            }}>
              <h3 style={{ margin: 0, fontSize: '24px', color: '#0b5ed7' }}>{stats.pendingAppts}</h3>
              <p style={{ margin: '4px 0', color: '#6b7280', fontSize: '12px' }}>Pending Approvals</p>
            </div>
            <div style={{
              background: '#f8f9fa',
              padding: '12px',
              borderRadius: '6px',
              borderLeft: '4px solid #0b5ed7',
              textAlign: 'center'
            }}>
              <h3 style={{ margin: 0, fontSize: '24px', color: '#0b5ed7' }}>{stats.totalRx}</h3>
              <p style={{ margin: '4px 0', color: '#6b7280', fontSize: '12px' }}>Total Prescriptions</p>
            </div>
          </div>
        </div>

        <div className="card">
          <h3>👥 User Management</h3>
          {users.length === 0 ? (
            <p className="muted">No users</p>
          ) : (
            <table>
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Role</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {users.map(u => (
                  <tr key={u.id}>
                    <td><strong>{u.name}</strong></td>
                    <td>{u.email}</td>
                    <td><span className={`badge ${getRoleBadge(u.role)}`}>{u.role}</span></td>
                    <td>
                      <button className="danger" onClick={() => handleDeleteUser(u.id)}>Delete</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

        <div className="card">
          <h3>📅 All Appointments</h3>
          {appointments.length === 0 ? (
            <p className="muted">No appointments</p>
          ) : (
            <table>
              <thead>
                <tr>
                  <th>Patient</th>
                  <th>Doctor</th>
                  <th>Date & Time</th>
                  <th>Status</th>
                  <th>Paid</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {appointments.map(a => {
                  const patient = load(Constants.DB_USERS_KEY).find(u => u.id === a.patientId)
                  const doctor = load(Constants.DB_USERS_KEY).find(u => u.id === a.doctorId)
                  return (
                    <tr key={a.id}>
                      <td>{patient ? patient.name : '(deleted)'}</td>
                      <td>{doctor ? doctor.name : '(deleted)'}</td>
                      <td>{new Date(a.datetime).toLocaleString()}</td>
                      <td><span className={`badge ${getStatusBadge(a.status)}`}>{a.status}</span></td>
                      <td>{a.paid ? <span style={{ color: '#155724' }}>✓ Yes</span> : <span style={{ color: '#9b1c1c' }}>✗ No</span>}</td>
                      <td>
                        <button className="danger" onClick={() => handleDeleteAppt(a.id)}>Delete</button>
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

export default AdminDashboard
