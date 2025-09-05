import { useState } from 'react'

function App() {
  const [count, setCount] = useState(0)

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">
          🏃‍♂️ Apaddicto
        </h1>
        <p className="text-lg text-gray-600 mb-8">
          Application de Thérapie Sportive
        </p>
        <div className="space-y-4">
          <button
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
            onClick={() => setCount((count) => count + 1)}
          >
            Count is {count}
          </button>
          <p className="text-sm text-gray-500">
            Frontend build successful - React app running
          </p>
        </div>
      </div>
    </div>
  )
}

export default App