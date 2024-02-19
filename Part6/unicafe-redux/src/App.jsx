import React from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { incrementGood, incrementOk, incrementBad, resetStats } from './actions'

const App = () => {
  const dispatch = useDispatch()
  const { good, ok, bad } = useSelector(state => state)

  const handleGood = () => {
    dispatch(incrementGood())
  }

  const handleOk = () => {
    dispatch(incrementOk())
  }

  const handleBad = () => {
    dispatch(incrementBad())
  }

  const handleReset = () => {
    dispatch(resetStats())
  }

  return (
    <div>
      <button onClick={handleGood}>good</button> 
      <button onClick={handleOk}>ok</button> 
      <button onClick={handleBad}>bad</button>
      <button onClick={handleReset}>reset stats</button>
      <div>good {good}</div>
      <div>ok {ok}</div>
      <div>bad {bad}</div>
    </div>
  )
}

export default App