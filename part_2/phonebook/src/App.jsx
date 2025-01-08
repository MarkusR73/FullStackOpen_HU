import { useState, useEffect } from 'react'
import Persons from './components/Persons'
import Filter from './components/Filter'
import PersonForm from './components/Forms'
import personService from './services/perser'

const App = () => {
  const [persons, setPersons] = useState([]) 
  const [newName, setNewName] = useState('')
  const [newNumber, setNewNumber] = useState('')
  const [filter, setFilter] = useState('')

  useEffect (() => {
    console.log('effect')
    personService
      .getAll()
      .then(initialPersons => {
        setPersons(initialPersons)
      })
      .catch(error => {
        console.error('Error fetching data:', error) // Log any errors
      })
  }, [])
  console.log('render', persons.length, 'persons')

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
        name: newName.trim(),
        number: newNumber.trim(),
      }
      personService
        .create(personObject)
        .then(returnedPerson => {
          setPersons(persons.concat(returnedPerson))
          setNewName('')
          setNewNumber('')
        })
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