import { useSelector, useDispatch } from 'react-redux'
import { voteAnecdote } from '../reducers/anecdoteReducer'
import { showNotification } from '../reducers/notificationReducer'

const AnecdoteList = () => {
	const dispatch = useDispatch()

  const anecdotes = useSelector(({ anecdotes, filter }) => {
		return [...anecdotes]
			.filter((a) => a.content.toLowerCase().includes(filter.toLowerCase()))
			.sort((a, b) => b.votes - a.votes)
	})

	const vote = (id, content) => {
		dispatch(voteAnecdote({ id }))
    dispatch(showNotification(`You voted for: "${content}"`, 5000))
	}

	return (
		<div>
      {anecdotes.map(anecdote => 
        <div key={anecdote.id}>
          <div>{anecdote.content}</div>
          <div>
            has {anecdote.votes}
            <button onClick={() => vote(anecdote.id, anecdote.content)}>vote</button>
          </div>
        </div>
      )}
		</div>
	)
}

export default AnecdoteList
