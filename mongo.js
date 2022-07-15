const mongoose = require('mongoose')
const args = process.argv

if(args.length<3){
    console.log('give password as argument')
    process.exit(1)
}
const password = process.argv[2]
const url = ''
mongoose.connect(url)

const personSchema = new mongoose.Schema({
    name: String,
    number: Number,
})
const Person = mongoose.model('Person', personSchema)
const person = new Person({
    name: args[3],
    number: args[4]
})
if(args.length === 3){
    Person
        .find({})
        .then(persons => {
            persons.forEach(person => {
                console.log(person.name, person.number)
            })
            mongoose.connection.close()
            return
        })
}
else {
    person.save().then(result => {
        console.log(`Added ${args[3]} number ${args[4]} to phonebook`)
        mongoose.connection.close()
    })
}