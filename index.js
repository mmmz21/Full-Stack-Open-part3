require("dotenv").config()
const express = require('express')
const app = express()
const morgan = require('morgan')
const cors = require('cors')
const Person = require('./models/person')


/*const requestLogger = (req, res, next) => {
  console.log('Method: ', req.method)
  console.log('Path: ', req.path)
  console.log('Body: ', req.body)
  console.log('---')
  next()
}*/

//middlewares
app.use(express.static('build'))
//activate's the express json-parser
app.use(express.json())
//app.use(requestLogger)
app.use(cors())

morgan.token('post-body', function (req, res) {
  if (req.method === 'POST') {
    return JSON.stringify(req.body)
  }
})

app.use(morgan(':method :url :status :res[content-length] - :response-time ms :post-body'))

app.get('/', (req, res) => {
  res.send('<h1> Phonebook!</h1>')
})

app.get('/info', (req, res) => {
  const num_ppl = persons.length
  let date = new Date()
  res.json(`Phonebook has info for ${num_ppl} people ${date}`)
})

// display all phonebook entries
app.get('/api/persons', (req, res) => {
  Person.find({}).then(people => {
    res.json(people.map(person => person.toJSON()))
  })
})

// fetch an individual entry using it's id
app.get('/api/persons/:id', (req, res) => {
  Person.findById(request.params.id).then(person => {
    res.json(person)
  })
})

// delete phonebook entries
app.delete('/api/persons/:id', (req, res) => {
  const id = Number(req.params.id)
  // filter out the entry that is being deleted
  persons = persons.filter(person => person.id !== id)
  res.status(204).end()
})

// add new phonebook entries to the server 
app.post('/api/persons', (req, res) => {
  const { body } = req
  if (body.content === undefined) {
    return res.status(400).json({ error: 'content missing' })
  }

  const person = new Person({
    name: body.name,
    number: body.number,
    id: Math.floor(Math.random() * Math.floor(100)),
  })

  person.save().then(savedPerson => {
    // response is sent only if operation succeeded
    res.json(savedPerson.toJSON())
  })
})

const unknownEndpoint = (req, res) => {
  res.status(404).send({ error: 'unknown endpoint' })
}
app.use(unknownEndpoint)
const PORT = process.env.PORT
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})
