import { useEffect, useState } from 'react'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { createClient } from '@supabase/supabase-js'
import Login from './pages/Login'
import './App.css'

const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL,
  import.meta.env.VITE_SUPABASE_ANON_KEY
)

interface Developer {
  id: string
  name: string
  company_name: string
  email: string
  status: string
}

function Home() {
  const [developers, setDevelopers] = useState<Developer[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [user, setUser] = useState<any>(null)

  useEffect(() => {
    checkAuth()
    fetchDevelopers()
  }, [])

  const checkAuth = async () => {
    const { data } = await supabase.auth.getSession()
    setUser(data?.session?.user || null)
  }

  const fetchDevelopers = async () => {
    try {
      setLoading(true)
      const { data, error: fetchError } = await supabase
        .from('developers')
        .select('id, name, company_name, email, status')
        .limit(10)

      if (fetchError) {
        setError(fetchError.message)
        return
      }

      setDevelopers(data || [])
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error')
    } finally {
      setLoading(false)
    }
  }

  const handleLogout = async () => {
    await supabase.auth.signOut()
    setUser(null)
    window.location.href = '/login'
  }

  return (
    <div className="container">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h1>Griya Sumut Berkah</h1>
          <p>KPR Syariah Developer Management System</p>
        </div>
        {user && (
          <button
            onClick={handleLogout}
            style={{
              padding: '0.5rem 1rem',
              backgroundColor: '#ff6b6b',
              color: '#fff',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer',
            }}
          >
            Logout
          </button>
        )}
      </div>

      {user && (
        <p style={{ marginTop: '1rem', fontSize: '0.9rem', color: '#888' }}>
          Logged in as: {user.email}
        </p>
      )}

      <div style={{ marginTop: '2rem' }}>
        <h2>Developers List</h2>

        {loading && <p>Loading developers...</p>}
        {error && <p style={{ color: 'red' }}>Error: {error}</p>}

        {!loading && developers.length === 0 && <p>No developers found</p>}

        {!loading && developers.length > 0 && (
          <ul style={{ textAlign: 'left', marginTop: '1rem' }}>
            {developers.map((dev) => (
              <li key={dev.id} style={{ marginBottom: '1rem' }}>
                <strong>{dev.name}</strong> ({dev.company_name})
                <br />
                Email: {dev.email}
                <br />
                Status: {dev.status}
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  )
}

function App() {
  const [user, setUser] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    checkAuth()

    const { data: authListener } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user || null)
    })

    return () => {
      authListener?.subscription.unsubscribe()
    }
  }, [])

  const checkAuth = async () => {
    const { data } = await supabase.auth.getSession()
    setUser(data?.session?.user || null)
    setLoading(false)
  }

  if (loading) return <div className="container"><p>Loading...</p></div>

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={user ? <Navigate to="/" /> : <Login />} />
        <Route path="/" element={user ? <Home /> : <Navigate to="/login" />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App