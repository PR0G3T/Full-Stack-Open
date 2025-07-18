import { useState, useEffect } from 'react'
import personService from './services/persons'

const Notification = ({ message, type }) => {
  if (message === null) {
    return null
  }

  const className = type === 'success' ? 'success' : 'error'

  return (
    <div className={className}>
      {message}
    </div>
  )
}

const Filter = ({ filter, handleFilterChange }) => {
  return (
    <div>
      filter shown with <input 
        value={filter} 
        onChange={handleFilterChange} 
      />
    </div>
  )
}

const PersonForm = ({ 
  addPerson, 
  newName, 
  handleNameChange, 
  newNumber, 
  handleNumberChange 
}) => {
  return (
    <form onSubmit={addPerson}>
      <div>
        name: <input 
          value={newName}
          onChange={handleNameChange}
        />
      </div>
      <div>
        number: <input 
          value={newNumber}
          onChange={handleNumberChange}
        />
      </div>
      <div>
        <button type="submit">add</button>
      </div>
    </form>
  )
}

const Person = ({ person, onDelete }) => {
  return (
    <div>
      {person.name} {person.number} 
      <button onClick={() => onDelete(person.id, person.name)}>delete</button>
    </div>
  )
}

const Persons = ({ persons, onDelete }) => {
  return (
    <div>
      {persons.map(person => 
        <Person key={person.id} person={person} onDelete={onDelete} />
      )}
    </div>
  )
}

const App = () => {
  const [persons, setPersons] = useState([])
  
  const [newName, setNewName] = useState('')
  const [newNumber, setNewNumber] = useState('')
  const [filter, setFilter] = useState('')
  
  const [notificationMessage, setNotificationMessage] = useState(null)
  const [notificationType, setNotificationType] = useState('success')

  const showNotification = (message, type = 'success') => {
    setNotificationMessage(message)
    setNotificationType(type)
    setTimeout(() => {
      setNotificationMessage(null)
    }, 5000)
  }
    useEffect(() => {
    console.log('effect')
    personService
      .getAll()
      .then(initialPersons => {
        console.log('promise fulfilled')
        setPersons(initialPersons)
      })
  }, [])
    const addPerson = (event) => {
    event.preventDefault()
    
    const existingPerson = persons.find(person => 
      person.name.toLowerCase() === newName.toLowerCase()
    )
    
    if (existingPerson) {
      if (window.confirm(`${newName} is already added to phonebook, replace the old number with a new one?`)) {
        const updatedPerson = { ...existingPerson, number: newNumber }
        
        personService
          .update(existingPerson.id, updatedPerson)
          .then(returnedPerson => {            setPersons(persons.map(person => 
              person.id !== existingPerson.id ? person : returnedPerson
            ))
            setNewName('')
            setNewNumber('')
            showNotification(`Updated ${returnedPerson.name}`)
          })
          .catch(error => {
            showNotification(
              `Information of ${newName} has already been removed from server`, 
              'error'
            )
            setPersons(persons.filter(person => person.id !== existingPerson.id))
          })
      }
      return
    }
    
    const personObject = {
      name: newName,
      number: newNumber,
    }

    personService
      .create(personObject)
      .then(returnedPerson => {        setPersons(persons.concat(returnedPerson))
        setNewName('')
        setNewNumber('')
        showNotification(`Added ${returnedPerson.name}`)
      })
      .catch(error => {
        showNotification(
          `Failed to add ${newName}. ${error.response?.data?.error || error.message}`, 
          'error'
        )
      })
  }

  const handleNameChange = (event) => {
    setNewName(event.target.value)
  }
  const handleNumberChange = (event) => {
    setNewNumber(event.target.value)
  }

  const handleFilterChange = (event) => {
    setFilter(event.target.value)
  }

  const personsToShow = filter === ''
    ? persons
    : persons.filter(person =>
        person.name.toLowerCase().includes(filter.toLowerCase())
      )
  
  const deletePerson = (id, name) => {
    if (window.confirm(`Delete ${name} ?`)) {
      personService
        .remove(id)        .then(() => {
          setPersons(persons.filter(person => person.id !== id))
          showNotification(`Deleted ${name}`)
        })
        .catch(error => {
          showNotification(
            `Information of ${name} has already been removed from server`, 
            'error'
          )
          setPersons(persons.filter(person => person.id !== id))
        })
    }
  }
  return (    <div>
      <h2>Phonebook</h2>
      
      <Notification message={notificationMessage} type={notificationType} />
      
      <Filter filter={filter} handleFilterChange={handleFilterChange} />

      <h3>Add a new</h3>
      
      <PersonForm 
        addPerson={addPerson}
        newName={newName}
        handleNameChange={handleNameChange}
        newNumber={newNumber}
        handleNumberChange={handleNumberChange}
      />

      <h3>Numbers</h3>
      
      <Persons persons={personsToShow} onDelete={deletePerson} />
    </div>
  )
}

export default App
