// Shared utilities and data layer
const DB_USERS_KEY = 'medf_users_v1'
const DB_APPTS_KEY = 'medf_appts_v1'
const DB_PRESC_KEY = 'medf_presc_v1'

export const load = (key) => JSON.parse(localStorage.getItem(key) || '[]')
export const save = (key, data) => localStorage.setItem(key, JSON.stringify(data))

// Seed default data
export const seedData = () => {
  const users = load(DB_USERS_KEY)
  if (users.length === 0) {
    users.push({
      id: uid(),
      name: 'Admin',
      email: 'admin@medf.test',
      password: 'admin',
      role: 'admin'
    })
    users.push({
      id: uid(),
      name: 'Dr. Alice',
      email: 'alice@medf.test',
      password: 'doctor',
      role: 'doctor'
    })
    users.push({
      id: uid(),
      name: 'Patient Bob',
      email: 'bob@medf.test',
      password: 'patient',
      role: 'patient'
    })
    users.push({
      id: uid(),
      name: 'John Pharmacist',
      email: 'john@medf.test',
      password: 'pharmacist',
      role: 'pharmacist'
    })
    save(DB_USERS_KEY, users)
  }
  if (!localStorage.getItem(DB_APPTS_KEY)) save(DB_APPTS_KEY, [])
  if (!localStorage.getItem(DB_PRESC_KEY)) save(DB_PRESC_KEY, [])
}

// Helpers
export const uid = () => Math.random().toString(36).slice(2, 10)
export const findUserByEmail = (email) => load(DB_USERS_KEY).find(u => u.email === email)

// Auth helpers
export const getCurrent = () => JSON.parse(sessionStorage.getItem('medf_current') || 'null')
export const logout = () => {
  sessionStorage.removeItem('medf_current')
}
export const setCurrentUser = (user) => {
  sessionStorage.setItem('medf_current', JSON.stringify(user))
}

// Constants
export const Constants = {
  DB_USERS_KEY,
  DB_APPTS_KEY,
  DB_PRESC_KEY
}
