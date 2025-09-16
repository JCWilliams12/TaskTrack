import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import axiosInstance from './api/config'

function App() {
  const [count, setCount] = useState(0)
  const [apiStatus, setApiStatus] = useState<string>('')

  const testApiConnection = async () => {
    try {
      const response = await axiosInstance.get('/health')
      setApiStatus(`API Status: ${response.status} - ${response.statusText}`)
    } catch (error) {
      setApiStatus('API Connection Failed - Server may not be running')
    }
  }

  return (
    <>
      <div>
        <a href="https://vite.dev" target="_blank">
          <img src={viteLogo} className="logo" alt="Vite logo" />
        </a>
        <a href="https://react.dev" target="_blank">
          <img src={reactLogo} className="logo react" alt="React logo" />
        </a>
      </div>
      <h1>Vite + React</h1>
      <div className="card">
        <button onClick={() => setCount((count) => count + 1)}>
          count is {count}
        </button>
        <p>
          Edit <code>src/App.tsx</code> and save to test HMR
        </p>
        <button onClick={testApiConnection} style={{ marginTop: '10px' }}>
          Test API Connection
        </button>
        {apiStatus && <p style={{ marginTop: '10px', color: apiStatus.includes('Failed') ? 'red' : 'green' }}>{apiStatus}</p>}
      </div>
      <p className="read-the-docs">
        Click on the Vite and React logos to learn more
      </p>
    </>
  )
}

export default App
