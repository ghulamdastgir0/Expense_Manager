import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
      <div className="bg-blue-500 min-h-screen flex items-center justify-center">
        <h1>Expense</h1>
        <div className="expense-tracker">
          <h2>Track your expenses</h2>
          <form>
            <input type="text" placeholder="Description" />
            <input type="number" placeholder="Amount" />
            <button type="submit">Add Expense</button>
          </form>
        </div>
      </div>
    </>
  )
}

export default App
