import { useState } from 'react'
import './App.css'

const usersDB = [
  { email: 'candidate@test.com', password: '1234', role: 'candidate' },
  { email: 'hr@test.com', password: '1234', role: 'hr' },
]

function App() {
  const [page, setPage] = useState('home')
  const [authMode, setAuthMode] = useState('login')
  const [role, setRole] = useState('candidate')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [user, setUser] = useState(null)

  const handleAuth = (e) => {
    e.preventDefault()
    setError('')

    if (!email || !password) {
      setError('Please fill in all fields.')
      return
    }

    if (authMode === 'signup') {
      const exists = usersDB.find((u) => u.email === email)
      if (exists) {
        setError('Email already registered.')
        return
      }
      const newUser = { email, password, role }
      usersDB.push(newUser)
      setUser(newUser)
      setPage(role === 'hr' ? 'dashboard' : 'candidate-form')
    } else {
      const found = usersDB.find((u) => u.email === email && u.password === password)
      if (!found) {
        setError('Invalid email or password.')
        return
      }
      setUser(found)
      setPage(found.role === 'hr' ? 'dashboard' : 'candidate-form')
    }
  }

  const handleLogout = () => {
    setUser(null)
    setEmail('')
    setPassword('')
    setError('')
    setPage('home')
  }

  // ── Home Page ──
  if (page === 'home') {
    return (
      <div className="container">
        <h1>AI Hiring Arena</h1>
        <button className="start-btn" onClick={() => setPage('auth')}>
          Start
        </button>
      </div>
    )
  }

  // ── Auth Page ──
  if (page === 'auth') {
    return (
      <div className="container">
        <div className="card">
          <h2>{authMode === 'login' ? 'Log In' : 'Sign Up'}</h2>

          <form onSubmit={handleAuth}>
            {authMode === 'signup' && (
              <div className="role-toggle">
                <button
                  type="button"
                  className={`role-btn ${role === 'candidate' ? 'active' : ''}`}
                  onClick={() => setRole('candidate')}
                >
                  Candidate
                </button>
                <button
                  type="button"
                  className={`role-btn ${role === 'hr' ? 'active' : ''}`}
                  onClick={() => setRole('hr')}
                >
                  HR
                </button>
              </div>
            )}

            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />

            {error && <p className="error">{error}</p>}

            <button type="submit" className="start-btn">
              {authMode === 'login' ? 'Log In' : 'Sign Up'}
            </button>
          </form>

          <p className="switch-text">
            {authMode === 'login' ? "Don't have an account?" : 'Already have an account?'}{' '}
            <span
              className="link"
              onClick={() => {
                setAuthMode(authMode === 'login' ? 'signup' : 'login')
                setError('')
              }}
            >
              {authMode === 'login' ? 'Sign Up' : 'Log In'}
            </span>
          </p>
        </div>
      </div>
    )
  }

  // ── Candidate Form Page ──
  if (page === 'candidate-form') {
    return (
      <div className="container">
        <div className="card wide">
          <div className="page-header">
            <h2>Candidate Form</h2>
            <button className="logout-btn" onClick={handleLogout}>Log Out</button>
          </div>
          <p className="subtitle">Welcome, {user?.email}</p>
          <form onSubmit={(e) => e.preventDefault()}>
            <input type="text" placeholder="Full Name" />
            <input type="text" placeholder="Skills (comma separated)" />
            <textarea placeholder="Tell us about yourself..." rows={4} />
            <button type="submit" className="start-btn">Submit</button>
          </form>
        </div>
      </div>
    )
  }

  // ── HR Dashboard Page ──
  if (page === 'dashboard') {
    return (
      <div className="container">
        <div className="card wide">
          <div className="page-header">
            <h2>HR Dashboard</h2>
            <button className="logout-btn" onClick={handleLogout}>Log Out</button>
          </div>
          <p className="subtitle">Welcome, {user?.email}</p>
          <div className="dashboard-content">
            <div className="stat-card">
              <span className="stat-number">0</span>
              <span className="stat-label">Applications</span>
            </div>
            <div className="stat-card">
              <span className="stat-number">0</span>
              <span className="stat-label">Interviews</span>
            </div>
            <div className="stat-card">
              <span className="stat-number">0</span>
              <span className="stat-label">Hired</span>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return null
}

export default App
