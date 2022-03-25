/*global process*/

const mongoose = require('mongoose')
require('dotenv').config()

const url = process.env.MONGODB_URI
mongoose.connect(url, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    console.log('connected to MongoDB')
  })
  .catch((error) => {
    console.log('error connection to MongoDB:', error.message)
  })

const personSchema = new mongoose.Schema({
  name: { type: 'String', required: true, unique: true, minlength: 3 },
  number: { type: 'String', required: true , unique: true, minlength: 8 },
})

const Person = mongoose.model('Person', personSchema)
personSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString()
    delete returnedObject._id
    delete returnedObject.__v
  }
})

module.exports = Person