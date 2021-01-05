const mongoose = require('mongoose')

if (process.argv.length < 3) {
    console.log('Please provide the password as an argument: node mongo.js <password>')
    process.exit(1)
}
const password = process.argv[2]
let newName = ''
let newNumber = ''

const url = `mongodb+srv://sampleuser:${password}@cluster0.mopyx.mongodb.net/people?retryWrites=true&w=majority`
mongoose.connect(url, { useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false, useCreateIndex: true })

const personSchema = new mongoose.Schema({
    name: String,
    number: String,
    id: Number,
})

const Person = mongoose.model('Person', personSchema)

if (process.argv.length === 3) {
    console.log('phonebook: ')
    Person.find({}).then(result => {
        result.forEach(person => {
            console.log(person.name, ' ', person.number)
        })
        mongoose.connection.close()
    })
}
else if (process.argv.length === 5) {
    newName = process.argv[3]
    newNumber = process.argv[4]
    const person = new Person({
        name: newName,
        number: newNumber,
        id: Math.floor(Math.random() * Math.floor(100)),
    })

    person.save().then(result => {
        console.log('added', newName, newNumber, 'to phonebook')
        mongoose.connection.close()
    })
}



