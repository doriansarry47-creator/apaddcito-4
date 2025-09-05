import { useState } from 'react'
import './App.css'

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
      <div>
        <h1>Apaddicto</h1>
        <h2>Application de Thérapie Sportive</h2>
      </div>
      <div className="card">
        <button onClick={() => setCount((count) => count + 1)}>
          count is {count}
        </button>
        <p>
          Bienvenue dans votre application de thérapie sportive
        </p>
      </div>
    </>
  )
}

export default App