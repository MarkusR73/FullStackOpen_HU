import { useState } from 'react'

const Header = ({text}) => {
  return( 
  <h1>
    {text}
  </h1> 
  )
}


const Button = ({text, onClick}) => {
  return(
    <button onClick={onClick}>
        {text}
    </button>
  )
}

const App = () => {
  const anecdotes = [
    'If it hurts, do it more often.',
    'Adding manpower to a late software project makes it later!',
    'The first 90 percent of the code accounts for the first 90 percent of the development time...The remaining 10 percent of the code accounts for the other 90 percent of the development time.',
    'Any fool can write code that a computer can understand. Good programmers write code that humans can understand.',
    'Premature optimization is the root of all evil.',
    'Debugging is twice as hard as writing the code in the first place. Therefore, if you write the code as cleverly as possible, you are, by definition, not smart enough to debug it.',
    'Programming without an extremely heavy use of console.log is same as if a doctor would refuse to use x-rays or blood tests when diagnosing patients.',
    'The only way to go fast, is to go well.'
  ]

  const [votes, setVotes] = useState(new Array(anecdotes.length).fill(0))

  const [mostVoted, setMostVoted] = useState(0)

  const [selected, setSelected] = useState(0)

  const getRandomInt = (max) => {
    const randomInt = Math.floor(Math.random() * max)
    console.log(randomInt)
    return randomInt
  }

  const vote = (index) => {
    // Make a copy of the votes array
    const newVotes = [...votes];
    // increment the value in position index by one 
    newVotes[index] += 1
    // Update the state with the new array
    setVotes(newVotes)

    // Update mostVoted with newVotes
    updateMostVoted(newVotes)
  }

  const updateMostVoted = (votes) => {
    // Find the index with the highest vote count
    const mostVotedIndex = votes.indexOf(Math.max(...votes))
    // Update state with the index of the most voted anecdote
    setMostVoted(mostVotedIndex)
  }

  return (
    <div>
      <Header text="Anecdote of the day"/>
      <p>
        {anecdotes[selected]}
      </p>
      <p>
        has {votes[selected]} votes
      </p>
      <Button text="vote" onClick={() => vote(selected)}/>
      <Button text="next anecdote" onClick={() => setSelected(getRandomInt(anecdotes.length - 1))}/>
      <Header text="Anecdote with most votes"/>
      <p>
        {anecdotes[mostVoted]}
      </p>
      <p>
        has {votes[mostVoted]} votes
      </p>
    </div>
  )
}

export default App