const { response } = require('express')
const express = require('express')
const nodemon = require('nodemon')
const app = express()
//activate's the express json-parser
app.use(express.json())
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

// display all phonebook entries
app.get('/api/persons', (req, res) => {
  res.json(persons)
})

app.get('/info', (req, res) => {
  const num_ppl = persons.length
  let date = new Date()
  res.json(`Phonebook has info for ${num_ppl} people ${date}`)
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
const PORT = 3001
app.listen(PORT)
console.log(`Server running on port ${PORT}`)
