import { useState } from 'react'
import Persons from './components/Persons'
import Filter from './components/Filter'
import PersonForm from './components/Forms'

const App = () => {
  const [persons, setPersons] = useState([
    {id: 1, name: 'Arto Hellas', number: '040-123456'},
    {id: 2, name: 'Ada Lovelace', number: '39-44-5323523'},
    {id: 3, name: 'Dan Abramov', number: '12-43-234345'},
    {id: 4, name: 'Mary Poppendieck', number: '39-23-6423122'}
  ]) 
  const [newName, setNewName] = useState('')
  const [newNumber, setNewNumber] = useState('')
  const [filter, setFilter] = useState('')

  const addPerson = (event) => {
    event.preventDefault()
    const nameExists = persons.some((person) => person.name === newName.trim())
    const numberExists = persons.some((person) => person.number === newNumber.trim())

    if (nameExists) {
      alert(`${newName} is already added to the phonebook`)
    }
    else if (numberExists) {
      alert(`${newNumber} is already added to the phonebook`)
    }
    else {
      const personObject = {
        id: persons.length,
        name: newName.trim(),
        number: newNumber.trim()
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
      <Filter value={filter} onChange={updateFilter}/>
      <h3>add a new</h3>
      <PersonForm 
        onSubmit={addPerson}
        newName={newName}
        updateName={updateName}
        newNumber={newNumber}
        updateNumber={updateNumber}
      />
      <h3>Numbers</h3>
      <Persons persons={personsToShow}/>
    </div>
  )
}

export default App