const mongoose = require('mongoose')

if (process.argv.length < 3) {
  console.log('give password as argument')
  process.exit(1)
}

const password = process.argv[2]

// MongoDB Atlas connection string
// Replace <username>, <cluster>, and <database> with your actual values
const url = `mongodb+srv://fullstack:${password}@cluster0.mongodb.net/phonebookApp?retryWrites=true&w=majority`

mongoose.set('strictQuery', false)

// Define the schema for a person
const personSchema = new mongoose.Schema({
  name: String,
  number: String,
})

// Create the model
const Person = mongoose.model('Person', personSchema)

// Connect to MongoDB
mongoose.connect(url)

if (process.argv.length === 3) {
  // Only password provided - list all persons
  console.log('phonebook:')
  Person.find({}).then(result => {
    result.forEach(person => {
      console.log(`${person.name} ${person.number}`)
    })
    mongoose.connection.close()
  })
} else if (process.argv.length === 5) {
  // Password, name, and number provided - add new person
  const name = process.argv[3]
  const number = process.argv[4]

  const person = new Person({
    name: name,
    number: number,
  })

  person.save().then(() => {
    console.log(`added ${name} number ${number} to phonebook`)
    mongoose.connection.close()
  })
} else {
  console.log('Usage:')
  console.log('  node mongo.js <password>                    - list all persons')
  console.log('  node mongo.js <password> <name> <number>    - add new person')
  process.exit(1)
}
