import React from 'react'
import { useSelector, useDispatch } from 'react-redux'

const App = () => {
  const dispatch = useDispatch()
  const { good, ok, bad } = useSelector(state => state)

  const handleGood = () => {
    dispatch({ type: 'GOOD' })
  }

  const handleOk = () => {
    dispatch({ type: 'OK' })
  }

  const handleBad = () => {
    dispatch({ type: 'BAD' })
  }

  const handleZero = () => {
    dispatch({ type: 'ZERO' })
  }

  return (
    <div>
      <h1>Give feedback</h1>
      <div>
        <button onClick={handleGood}>good</button>
        <button onClick={handleOk}>ok</button>
        <button onClick={handleBad}>bad</button>
        <button onClick={handleZero}>reset to zero</button>
      </div>
      
      <h2>Statistics</h2>
      <div>
        <div>good {good}</div>
        <div>ok {ok}</div>
        <div>bad {bad}</div>
      </div>
    </div>
  )
}

export default App
