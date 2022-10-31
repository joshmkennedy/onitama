import { } from 'react'
import './App.css'
import Board from './Board'
import { StateWrapper } from './state'

function App() {
  return (
    <StateWrapper>
      <div className="App">
        <Board />
      </div>
    </StateWrapper>
  )
}

export default App
