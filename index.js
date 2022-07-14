const express = require('express')
const morgan = require('morgan')
const cors = require('cors')
const app = express()

app.use(express.static('build'))
app.use(cors())
app.use(express.json())
app.use(morgan(':method :url :status :content - :response-time ms'))

morgan.token('content', (req, res) => JSON.stringify(req.body))

let persons = [
    {
        id: 1,
        name: "Arto Hellas",
        number: "040-123456"
    },
    {
        id: 2,
        name: "Ada Lovelace",
        number: "39-44-5323523"
    },
    {
        id: 3,
        name: "Dan Abramov",
        number: "12-43-234345"
    },
    {
        id: 4,
        name: "Mary Poppendick",
        number: "39-23-6423122"
    }
]

app.get('/info', (req, res) => {
    const date = new Date()
    res.send(
    `<h2>Phonebook has info for ${persons.length} people
    <br/><br/>${date}</h2>`
    )
})

app.get('/api/persons', (req, res) => {
    res.json(persons)
})

app.get('/api/persons/:id', (req, res) => {
    const id = Number(req.params.id)
    const person = persons.find(person => person.id === id)
    person ? res.json(person) : res.status(404).end()
})

app.post('/api/persons', (req, res) => {
    const body = req.body
    const id = generateId()
    if(!body.name)
        return res.status(400).json({error: 'must include name'})
    if(!body.number)
        return res.status(400).json({error: 'must include number'})
    if(persons.find(p => p.name == body.name))
        return res.status(400).json({error: 'name must be unique'})        
    
    const person = {
        name: body.name,
        number: body.number,
        id: id
    }
    
    persons = persons.concat(person)
    res.json(person)
})

const generateId = () => Math.floor(Math.random() * 100)

app.delete('/api/persons/:id', (req, res) => {
    const id = Number(req.params.id)
    persons = persons.filter(person => person.id !== id)
    res.status(204).end()
})

const unknownEndpoint = (request, response) => {
    response.status(404).send({ error: 'unknown endpoint' })
  }

app.use(unknownEndpoint)

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})