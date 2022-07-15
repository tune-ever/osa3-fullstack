require('dotenv').config()
const express = require('express')
const morgan = require('morgan')
const cors = require('cors')
const app = express()
const Person = require('./models/person')
const { response } = require('express')
const { default: mongoose } = require('mongoose')

app.use(express.static('build'))
app.use(express.json())
app.use(cors())
app.use(morgan(':method :url :status :content - :response-time ms'))

morgan.token('content', (req, res) => JSON.stringify(req.body))

app.get('/info', (req, res) => {
    const date = new Date()
    let i = 0
    Person.find({}).then(persons =>{
        res.send(
        `<h2>Phonebook has info for ${persons.length} people
         <br/><br/>${date}</h2>`
         )
    })
    
})

app.get('/api/persons', (req, res) => {
    Person.find({}).then(persons => {
        res.json(persons)
    })
})

app.get('/api/persons/:id', (req, res, next) => {
    Person.findById(req.params.id).then(person => {
        person ? res.json(person) : res.status(404).end()
    }).catch(error => next(error))
})

app.post('/api/persons', (req, res, next) => {
    const body = req.body
    const id = generateId()
    if(!body.name)
        return next(new Error('name must be unique'))
    if(!body.number)
        return next(new Error('Must include number'))  
    const person = new Person({
        name: body.name,
        number: body.number,
        id: id
    })
    person.save().then(savedPerson => {
        res.json(savedPerson)
    })
})

const generateId = () => Math.floor(Math.random() * 100)

app.put('/api/persons/:id', (req, res) => {
    const body = req.body

    const person = {
        name: body.name,
        number: body.number
    }

    Person.findByIdAndUpdate(req.params.id, person)
            .then(updatedPerson => {
                res.json(updatedPerson)
            })
            .catch(error => next(error))
})

app.delete('/api/persons/:id', (req, res, next) => {
    Person.findByIdAndRemove(req.params.id)
        .then(result => res.status(204).end())
        .catch(error => next(error))
})

const unknownEndpoint = (req, res) => {
    res.status(404).send({ error: 'unknown endpoint' })
  }

app.use(unknownEndpoint)

const PORT = process.env.PORT
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})

const errorHandler = (error, req, res, next) => {
    console.log(error.message)

    if(error.name === 'CastError') {
        return res.status(400).send({error:'malformatted id'})
    }
    if(error.name === 'Must include number'){
        return res.status(400).send({error: 'no number'})
    }
    next(error)
}

app.use(errorHandler)