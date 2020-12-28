require("dotenv").config()
const express = require('express')
const app = express()
const morgan = require('morgan')
const cors = require('cors')


const requestLogger = (req, res, next) => {
  console.log('Method: ', req.method)
  console.log('Path: ', req.path)
  console.log('Body: ', req.body)
  console.log('---')
  next()
}
//middlewares
app.use(express.static('build'))
//activate's the express json-parser
app.use(express.json())
app.use(requestLogger)
app.use(cors())

morgan.token('post-body', function (req, res) {
  if (req.method === 'POST') {
    return JSON.stringify(req.body)
  }
})
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :post-body'))
let persons = [
  {
    "name": "Harry Hole",
    "number": "123457789",
    "id": 14
  },
  {
    "name": "Jennifer Asiks",
    "number": "129010219",
    "id": 15
  }
]
app.get('/', (req, res) => {
  response.send('<h1> Phonebook!</h1>')
})

app.get('/info', (req, res) => {
  const num_ppl = persons.length
  let date = new Date()
  res.json(`Phonebook has info for ${num_ppl} people ${date}`)
})

// display all phonebook entries
app.get('/api/persons', (req, res) => {
  res.json(persons)
})

// fetch an individual entry using it's id
app.get('/api/persons/:id', (req, res) => {
  const id = Number(req.params.id)
  const person = persons.find(person => person.id === id)
  if (person) {
    res.json(person)
  } else {
    res.status(404).end()
  }
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
  const body = req.body
  const same = persons.find(person => person.name === body.name)

  if (!body.name) {
    return response.status(400).json({
      error: 'name missing'
    })
  }
  else if (same) {
    return response.status(400).json({
      error: 'name must be unique'
    })
  }
  else if (!body.num) {
    return response.status(400).json({
      error: 'number missing'
    })
  }
  const person = {
    name: body.name,
    number: body.num,
    id: Math.floor(Math.random() * Math.floor(100)),
  }

  persons = persons.concat(person)
  res.json(persons)
})
const unknownEndpoint = (req, res) => {
  res.status(404).send({ error: 'unknown endpoint' })
}
app.use(unknownEndpoint)
const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})
