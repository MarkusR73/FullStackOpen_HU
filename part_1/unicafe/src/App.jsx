import { useState } from 'react'

const Header = (props) => {
  console.log(props)
  return( 
  <h1>
    {props.text}
  </h1> 
  )
}

const Button = (props) => {
  return(
    <button onClick={props.onClick}>
      {props.text}
    </button>
  )
}

const Display = (props) => {
  return(
    <div>
      {props.text} {props.value}
    </div>
  )
}

const App = () => {
  // save clicks of each button to its own state
  const [good, setGood] = useState(0)
  const [neutral, setNeutral] = useState(0)
  const [bad, setBad] = useState(0)

  const totalFeedback = good + neutral + bad
  const average = (good - bad) / totalFeedback
  // Unusual computations order since "good / totalFeedback * 100" introduced rounding errors
  const posPerc = good * 100 / totalFeedback

  return (
    <div>
      <Header text="give feedback"/>
      <Button onClick={() => setGood(good + 1)} text="good"/>
      <Button onClick={() => setNeutral(neutral + 1)} text="neutral"/>
      <Button onClick={() => setBad(bad + 1)} text="bad"/>
      <Header text="statistics"/>
      <Display text="good" value={good}/>
      <Display text="neutral" value={neutral}/>
      <Display text="bad" value={bad}/>
      <Display text="all" value={totalFeedback} />
      <Display text="average" value={average}/>
      <Display text="positive" value={posPerc + " %"}/>
    </div>
  )
}

export default App