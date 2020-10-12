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

app.get('/api/persons', (req, res) => {
  res.json(persons)
})

app.get('/info', (req, res) => {
  const num_ppl = persons.length
  let date = new Date()
  res.json(`Phonebook has info for ${num_ppl} people ${date}`)
})

const PORT = 3001
app.listen(PORT)
console.log(`Server running on port ${PORT}`)
