import { useState } from 'react'

const Header = ({text}) => {
  return( 
  <h1>
    {text}
  </h1> 
  )
}

const Button = ({onClick, text}) => {
  return(
    <button onClick={onClick}>
      {text}
    </button>
  )
}

const Display = ({text, value}) => {
  return(
    <div>
      {text} {value}
    </div>
  )
}

// a proper place to define a component
const Statistics = ({good, neutral, bad, totalFeedback, average, posPerc}) => {
  
  if (!totalFeedback) {
    return <p>No feedback given</p>;
  }

  return(
    <div>
      <Display text="good" value={good}/>
      <Display text="neutral" value={neutral}/>
      <Display text="bad" value={bad}/>
      <Display text="all" value={totalFeedback} />
      <Display text="average" value={average}/>
      <Display text="positive" value={posPerc + " %"}/>
    </div>
  )
}

const App = () => {
  // save clicks of each button to its own state
  const [good, setGood] = useState(0)
  const [neutral, setNeutral] = useState(0)
  const [bad, setBad] = useState(0)

  const totalFeedback = good + neutral + bad

  return (
    <div>
      <Header text="give feedback"/>
      <Button onClick={() => setGood(good + 1)} text="good"/>
      <Button onClick={() => setNeutral(neutral + 1)} text="neutral"/>
      <Button onClick={() => setBad(bad + 1)} text="bad"/>
      <Header text="statistics"/>
      <Statistics 
        good={good} 
        neutral={neutral} 
        bad={bad} 
        totalFeedback={totalFeedback} 
        average={(good - bad) / totalFeedback} 
        posPerc={good * 100 / totalFeedback} 
      />
    </div>
  )
}

export default App