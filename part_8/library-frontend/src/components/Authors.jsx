import { useState } from 'react'
import { useMutation } from '@apollo/client'
import Select from 'react-select'
import { UPDATE_AUTHOR, ALL_AUTHORS } from '../queries'

const Authors = (props) => {
  const [name, setName] = useState(null)
  const [birthyear, setBirthyear] = useState('')

  const [updateAuthor] = useMutation(UPDATE_AUTHOR, {
    refetchQueries: [{ query: ALL_AUTHORS }]
  })

  if (!props.show) {
    return null
  }
  if (props.loading) {
		return <p>Loading books...</p>
	}

	if (props.error) {
		return <p>Error fetching books: {props.error.message}</p>
	}

  const authors = props.data?.allAuthors || []

  const nameOptions = authors.map((a) => ({
    value: a.name,
    label: a.name
  }))

  const submit = async (event) => {
    event.preventDefault()

    updateAuthor({  
      variables: {
        name: name.value,
        born: Number(birthyear),
      }
    })

    setName(null)
    setBirthyear('')
  }


  return (
    <div>
      <h2>Authors</h2>
      <table>
        <tbody>
          <tr>
            <th></th>
            <th>born</th>
            <th>books</th>
          </tr>
          {authors.map((a) => (
            <tr key={a.name}>
              <td>{a.name}</td>
              <td>{a.born}</td>
              <td>{a.bookCount}</td>
            </tr>
          ))}
        </tbody>
      </table>
      {props.token && (
        <div>
          <h2>Set birthyear</h2>
          <form onSubmit={submit}>
            <div>
              <Select
                value={name}
                onChange={setName}
                options={nameOptions}
              />
            </div>
            <div>
              born
              <input
                type="number"
                value={birthyear}
                onChange={({ target }) => setBirthyear(target.value)} 
              />
            </div>
            <button type="submit" disabled={!name || birthyear === ''}>
              update author
            </button>
          </form>
        </div>
      )}
    </div>
  )
}

export default Authors
