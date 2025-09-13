import { useState } from 'react'
import './App.css'

function App() {
  const [inputText, setInputText] = useState<string>('')

  const handleSubmit = () => {
    console.log(inputText)
  }

  return (
    <div className="container">
      <div className="image-placeholder"></div>
      <div className="input-container">
        <input
          id="test-input"
          type="text"
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          placeholder="test"
        />
        <button onClick={handleSubmit}>Enter</button>
      </div>
    </div>
  )
}

export default App
