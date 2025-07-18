require('dotenv').config({ path: 'C:/Users/killi/Documents/GitHub/Full-Stack-Open/part3/.env' })
const express = require('express')
const morgan = require('morgan')
const cors = require('cors')
const Person = require('./models/person')
const app = express()

// Custom token for logging request body
morgan.token('body', (req) => {
  return JSON.stringify(req.body)
})

// Middleware
app.use(cors())
app.use(express.static('dist'))
app.use(express.json())

// Exercise 3.7: Morgan with tiny configuration
app.use(morgan('tiny'))

// Exercise 3.8: Additional morgan configuration for POST requests to show request body
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :body', {
  skip: function (req) { return req.method !== 'POST' }
}))

// Exercise 3.13: GET all persons from database
app.get('/api/persons', (request, response) => {
  Person.find({}).then(persons => {
    response.json(persons)
  })
})

// Exercise 3.2: Info page
app.get('/info', (request, response) => {
  const currentTime = new Date()

  Person.countDocuments({}).then(count => {
    const html = `
      <div>
        <p>Phonebook has info for ${count} people</p>
        <p>${currentTime}</p>
      </div>
    `
    response.send(html)
  })
})

// Exercise 3.3: GET single person
app.get('/api/persons/:id', (request, response, next) => {
  Person.findById(request.params.id)
    .then(person => {
      if (person) {
        response.json(person)
      } else {
        response.status(404).end()
      }
    })
    .catch(error => next(error))
})

// Exercise 3.4: DELETE person
app.delete('/api/persons/:id', (request, response, next) => {
  Person.findByIdAndDelete(request.params.id)
    .then(() => {
      response.status(204).end()
    })
    .catch(error => next(error))
})

// Exercise 3.14: POST new person to database
app.post('/api/persons', (request, response, next) => {
  const body = request.body

  // Check if name or number is missing
  if (!body.name || !body.number) {
    return response.status(400).json({
      error: 'name or number is missing'
    })
  }

  // Create new person
  const person = new Person({
    name: body.name,
    number: body.number
  })

  person.save()
    .then(savedPerson => {
      response.json(savedPerson)
    })
    .catch(error => next(error))
})

// Exercise 3.17: PUT request to update person
app.put('/api/persons/:id', (request, response, next) => {
  const { name, number } = request.body

  // Check if name or number is missing
  if (!name || !number) {
    return response.status(400).json({
      error: 'name or number is missing'
    })
  }

  const person = {
    name: name,
    number: number,
  }

  Person.findByIdAndUpdate(request.params.id, person, { new: true, runValidators: true, context: 'query' })
    .then(updatedPerson => {
      if (updatedPerson) {
        response.json(updatedPerson)
      } else {
        response.status(404).end()
      }
    })
    .catch(error => next(error))
})

// Enhanced error handling middleware
const errorHandler = (error, request, response, next) => {
  console.error(error.message)

  if (error.name === 'CastError') {
    return response.status(400).send({ error: 'malformatted id' })
  } else if (error.name === 'ValidationError') {
    return response.status(400).json({ error: error.message })
  } else if (error.name === 'MongoServerError' && error.code === 11000) {
    return response.status(400).json({ error: 'expected `name` to be unique' })
  }

  next(error)
}

// this has to be the last loaded middleware.
app.use(errorHandler)

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})
