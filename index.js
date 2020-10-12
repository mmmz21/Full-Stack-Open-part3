const { notEqual } = require('assert')
const { response } = require('express')
const express = require('express')
const app = express()

let persons = [
  {
    "name": "Harry",
    "number": "Hole",
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
const PORT = 3001
app.listen(PORT)
console.log(`Server running on port ${PORT}`)
