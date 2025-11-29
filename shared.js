// ---------- Shared data layer and utilities ----------
const DB_USERS_KEY = 'medf_users_v1'
const DB_APPTS_KEY = 'medf_appts_v1'
const DB_PRESC_KEY = 'medf_presc_v1'

function load(key){return JSON.parse(localStorage.getItem(key) || '[]')}
function save(key, data){localStorage.setItem(key, JSON.stringify(data))}

// Seed a default admin and sample doctor/patient if no users exist
(function seed(){
  const users = load(DB_USERS_KEY)
  if(users.length===0){
    users.push({id:uid(),'name':'Admin','email':'admin@medf.test','password':'admin','role':'admin'})
    users.push({id:uid(),'name':'Dr. Alice','email':'alice@medf.test','password':'doctor','role':'doctor'})
    users.push({id:uid(),'name':'Patient Bob','email':'bob@medf.test','password':'patient','role':'patient'})
    save(DB_USERS_KEY, users)
  }
  if(!localStorage.getItem(DB_APPTS_KEY)) save(DB_APPTS_KEY, [])
  if(!localStorage.getItem(DB_PRESC_KEY)) save(DB_PRESC_KEY, [])
})()

// Helpers
function uid(){return Math.random().toString(36).slice(2,10)}
function findUserByEmail(email){return load(DB_USERS_KEY).find(u=>u.email===email)}
function getCurrent(){return JSON.parse(sessionStorage.getItem('medf_current')||'null')}

function logout(){
  sessionStorage.removeItem('medf_current')
  window.location.href = 'index.html'
}

function requireAuth(){
  const user = getCurrent()
  if(!user){
    alert('Login required')
    window.location.href = 'index.html'
  }
  return user
}
