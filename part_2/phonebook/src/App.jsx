import { useState } from 'react'
import Person from './components/Person'

const App = () => {
  const [persons, setPersons] = useState([
    { name: 'Arto Hellas', number: '040-123456', id: 1 },
    { name: 'Ada Lovelace', number: '39-44-5323523', id: 2 },
    { name: 'Dan Abramov', number: '12-43-234345', id: 3 },
    { name: 'Mary Poppendieck', number: '39-23-6423122', id: 4 }
  ]) 
  const [newName, setNewName] = useState('')
  const [newNumber, setNewNumber] = useState('')
  const [filter, setFilter] = useState('')

  const addPerson = (event) => {
    event.preventDefault()
    const nameExists = persons.some((person) => person.name === newName)
    const numberExists = persons.some((person) => person.number === newNumber)

    if (nameExists) {
      alert(`${newName} is already added to the phonebook`)
    }
    else if (numberExists) {
      alert(`${newNumber} is already added to the phonebook`)
    }
    else {
      const personObject = {
        name: newName,
        number: newNumber,
        id: persons.length
      }
      setPersons(persons.concat(personObject))
      setNewName('')
      setNewNumber('')
    }
  }

  const updateName = (event) => {
    console.log(event.target.value)
    setNewName(event.target.value)
  }

  const updateNumber = (event) => {
    console.log(event.target.value)
    setNewNumber(event.target.value)
  }

  const updateFilter = (event) => {
    console.log(event.target.value)
    setFilter(event.target.value)
  }

  const personsToShow = filter
    ? persons.filter((person) => person.name.toLowerCase().includes(filter.toLowerCase()))
    : persons

  return (
    <div>
      <h2>Phonebook</h2>
      <div>
          filter shown with <input value={filter} onChange={updateFilter}/>
      </div>
      <h2>add a new</h2>
      <form onSubmit={addPerson}>
        <div>
          name: <input 
            value={newName}
            onChange={updateName}
          />
        </div>
        <div>
          number: <input value={newNumber} onChange={updateNumber}/>
        </div>
        <div>
          <button type="submit">add</button>
        </div>
      </form>
      <h2>Numbers</h2>
      {personsToShow.map(person => 
        <Person key={person.name} person={person}/>
      )}
    </div>
  )
}

export default App