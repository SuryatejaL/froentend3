# Medical Consultation App - React Version

A modern React-based medical consultation application with separate dashboards for patients, doctors, pharmacists, and administrators.

## Features

- **Patient Dashboard**: Book appointments, view appointment status, access prescriptions
- **Doctor Dashboard**: Manage appointments, approve bookings, write prescriptions
- **Pharmacist Dashboard**: Manage prescriptions, mark as dispensed
- **Admin Dashboard**: User management, view all appointments and statistics
- **Authentication**: Email/password based login and registration
- **Local Storage**: Data persistence using browser localStorage

## Tech Stack

- **Frontend Framework**: React 18.2.0
- **Build Tool**: Create React App (react-scripts)
- **State Management**: React Hooks (useState, useEffect)
- **Storage**: Browser localStorage
- **Styling**: CSS

## Project Structure

```
src/
├── App.js                          # Main app component with routing logic
├── App.css                         # Global styles
├── utils.js                        # Utility functions and data layer
├── components/
│   ├── LoginRegister.js           # Login and registration
│   ├── PatientDashboard.js        # Patient dashboard
│   ├── DoctorDashboard.js         # Doctor dashboard
│   ├── PharmacistDashboard.js     # Pharmacist dashboard
│   └── AdminDashboard.js          # Admin dashboard
public/
├── index.html                      # HTML entry point
```

## Installation

1. Navigate to the project directory:
```bash
cd "c:\front207\online medic"
```

2. Install dependencies:
```bash
npm install
```

## Running the Application

Start the development server:
```bash
npm start
```

The app will automatically open in your browser at `http://localhost:3000`

## Demo Credentials

| Role | Email | Password |
|------|-------|----------|
| Admin | admin@medf.test | admin |
| Doctor | alice@medf.test | doctor |
| Patient | bob@medf.test | patient |
| Pharmacist | john@medf.test | pharmacist |

## How to Use

1. **Login/Register**: Use the demo credentials above or create a new account
2. **Patient**: Book appointments with available doctors, track appointment status
3. **Doctor**: Review pending appointments, approve and send video links, write prescriptions
4. **Pharmacist**: View and mark prescriptions as dispensed
5. **Admin**: Manage users, view all appointments, monitor system statistics

## Building for Production

Create an optimized production build:
```bash
npm run build
```

This creates a `build` folder with optimized production files.

## Data Storage

All data is stored in browser localStorage using the following keys:
- `medf_users_v1` - User accounts
- `medf_appts_v1` - Appointments
- `medf_presc_v1` - Prescriptions

**Note**: Data persists across browser sessions but is cleared if localStorage is cleared.

## Features in Detail

### Patient Dashboard
- View available doctors
- Book appointments with date/time and reason
- Pay simulation (₹500 fixed amount)
- View appointment status
- Access prescriptions from completed appointments
- Join video calls with approved appointments

### Doctor Dashboard
- View pending appointments from patients
- Approve appointments and send video call links
- View approved and completed appointments
- Write prescriptions for patients
- Mark appointments as completed

### Pharmacist Dashboard
- View all prescriptions
- Mark prescriptions as dispensed
- Undo dispensing if needed
- Track pending and completed prescriptions

### Admin Dashboard
- View system statistics (users, appointments, pending approvals)
- Manage user accounts (view and delete)
- View all appointments across the system
- Delete appointments if needed
- Monitor payment status

## Browser Compatibility

- Chrome (recommended)
- Firefox
- Safari
- Edge

## Notes

- This is a frontend-only prototype
- Session data uses sessionStorage (cleared when browser closes)
- Persistent data uses localStorage (survives browser restart)
- No backend server required for basic functionality
