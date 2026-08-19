import { useEffect, useState } from 'react'
import './App.css'

function App() {
  const [count, setCount] = useState(0)
  const [apiMessage, setApiMessage] = useState('loading...')

  useEffect(() => {
    fetch('/api/ping')
      .then((res) => res.json())
      .then((data) => setApiMessage((data as { message: string }).message))
      .catch(() => setApiMessage('failed to reach worker'))
  }, [])

  return (
    <main>
      <h1>retro-board</h1>
      <p>Vite + React + Cloudflare Worker 空殼專案</p>
      <button type="button" className="counter" onClick={() => setCount((c) => c + 1)}>
        Count is {count}
      </button>
      <p>
        <code>/api/ping</code> → {apiMessage}
      </p>
    </main>
  )
}

export default App
