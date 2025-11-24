import { useState } from 'react'
import './App.css'

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
      <h1>Vite + React Web front-end POC</h1>
      <div className="card">
        <button onClick={() => setCount((count) => count - 1)}>-</button>
        <button>count is {count}</button>
        <button onClick={() => setCount((count) => count + 1)}>+</button>
      </div>
    </>
  )
}

export default App
