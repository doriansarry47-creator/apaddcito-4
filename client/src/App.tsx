import React from 'react'

function App() {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="max-w-md w-full bg-white rounded-lg shadow-md p-6">
        <h1 className="text-2xl font-bold text-center text-gray-800 mb-4">
          Apaddicto
        </h1>
        <p className="text-center text-gray-600 mb-6">
          Application de Thérapie Sportive
        </p>
        <div className="space-y-4">
          <button className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition-colors">
            Se connecter
          </button>
          <button className="w-full bg-gray-200 text-gray-800 py-2 px-4 rounded-md hover:bg-gray-300 transition-colors">
            Créer un compte
          </button>
        </div>
        <div className="mt-6 text-center">
          <a href="/api/test-db" className="text-blue-600 hover:text-blue-800 text-sm">
            Test de la base de données
          </a>
        </div>
      </div>
    </div>
  )
}

export default App