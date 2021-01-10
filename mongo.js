const mongoose = require('mongoose')
const dotenv = require('dotenv');
dotenv.config();

let newName = ''
let newNumber = ''

mongoose.connect(process.env.MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false, useCreateIndex: true })
    .then(() => {
        console.log('connected to db')
    })
    .catch((err) => {
        console.log(err)
        process.exit(1)
    })

const personSchema = new mongoose.Schema({
    name: String,
    number: String,
    id: Number,
})

const Person = mongoose.model('Person', personSchema)

/*if (process.argv.length === 3) {
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
}*/



