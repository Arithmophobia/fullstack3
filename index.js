const express = require('express')
const morgan = require('morgan')
const app = express()
const bodyParser = require('body-parser')
const cors = require('cors')
const mongoose = require('mongoose')
const Person = require('./models/person')

app.use(cors())
app.use(express.static('build'))

morgan.token('data', function getData(req) {
  return req.data
})

function assignData(req, res, next) {
  req.data = JSON.stringify(req.body)
  next()
}
// first convert to json!
app.use(bodyParser.json())
// then save data in string
app.use(assignData)
// finally log data
app.use(morgan(':method :url :data :status :res[content-length] - :response-time ms'))
//app.use(morgan('tiny'))

app.get('/', (req, res) => {
  res.send('<h1>Hello World!</h1>')
})

app.get('/info', (req, res) => {
  Person
    .find({}, { __v: 0 })
    .then(persons => {
      const num = persons.length
      const date = new Date()
      res.send('<div><div>puhelinluettelossa ' + num + ' henkilön tiedot</div>'
        + '<div>' + date + '</div></div>')
    })
    .catch(error => {
      console.log(error)
      res.status(404).end()
    })
})

app.get('/api/persons', (req, res) => {
  //res.json(persons)
  Person
    .find({}, { __v: 0 })
    .then(persons => {
      res.json(persons.map(Person.format))
    })
    .catch(error => {
      console.log(error)
      res.status(404).end()
    })
})

app.get('/api/persons/:id', (request, response) => {
  Person
    .findById(request.params.id)
    .then(person => {
      if (person) {
        response.json(Person.format(person))
      } else {
        response.status(404).end()
      }
    })
    .catch(error => {
      console.log(error)
      response.status(400).send({ error: 'malformatted id' })
    })
})

app.delete('/api/persons/:id', (request, response) => {
  Person
    .findByIdAndRemove(request.params.id)
    .then(result => {
      response.status(204).end()
    })
    .catch(error => {
      response.status(400).send({ error: 'malformatted id' })
    })
})

app.put('/api/persons/:id', (request, response) => {
  const body = request.body

  const person = {
    name: body.name,
    number: body.number
  }

  Person
    .findByIdAndUpdate(request.params.id, person, { new: true })
    .then(updatedPerson => {
      response.json(Person.format(updatedPerson))
    })
    .catch(error => {
      console.log(error)
      response.status(400).send({ error: 'malformatted id' })
    })
})

app.post('/api/persons', (request, response) => {
  const body = request.body

  if (body.name === undefined) {
    return response.status(400).json({ error: 'name missing' })
  }
  if (body.number === undefined) {
    return response.status(400).json({ error: 'number missing' })
  }

  const person = new Person({
    name: body.name,
    number: body.number
  })

  Person
    .find({ name: person.name })
    .then(result => {
      if (result.length > 0) {
        response.status(400).send({ error: 'name already added' })
      } else {
        person
          .save()
          .then(savedPerson => {
            response.json(Person.format(savedPerson))
          })
          .catch(error => {
            console.log(error)
            response.status(400).send({ error: 'something went wrong :<' })
          })
      }
    })
})

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})