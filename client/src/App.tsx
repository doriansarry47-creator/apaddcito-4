import { useState } from 'react';
import './App.css';

function App() {
  const [count, setCount] = useState(0);

  return (
    <div className="App">
      <div>
        <h1>Apaddicto</h1>
        <div className="card">
          <button onClick={() => setCount((count) => count + 1)}>
            count is {count}
          </button>
          <p>
            Welcome to Apaddicto - Your fitness companion!
          </p>
        </div>
      </div>
    </div>
  );
}

export default App;