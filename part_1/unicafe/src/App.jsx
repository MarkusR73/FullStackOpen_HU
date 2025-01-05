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

const StatisticLine = ({text, value}) => {
  return(
    <tr>
      <td>{text}</td>
      <td>{value}</td> 
    </tr>
  )
}

// a proper place to define a component
const Statistics = ({good, neutral, bad, totalFeedback, average, posPerc}) => {
  
  if (!totalFeedback) {
    return <p>No feedback given</p>;
  }

  return(
    <table>
      <StatisticLine text="good" value={good}/>
      <StatisticLine text="neutral" value={neutral}/>
      <StatisticLine text="bad" value={bad}/>
      <StatisticLine text="all" value={totalFeedback} />
      <StatisticLine text="average" value={average}/>
      <StatisticLine text="positive" value={posPerc + " %"}/>
    </table>
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