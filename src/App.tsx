import { useState } from 'react'
import './App.css'

function App() {
  const [count, setCount] = useState(0)

  return (
    <div className="container">
      <h1>Griya Sumut Berkah</h1>
      <p>KPR Syariah Developer Management System</p>
      <button onClick={() => setCount((count) => count + 1)}>
        count is {count}
      </button>
      <p>Welcome! Application is loading...</p>
    </div>
  )
}

export default App