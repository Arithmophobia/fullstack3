const mongoose = require('mongoose')
if ( process.env.NODE_ENV !== 'production' ) {
  require('dotenv').config()
}
const url = process.env.MONGODB_URI

mongoose.connect(url, { useNewUrlParser: true })

const Person = mongoose.model('Person', {
    name: String,
    number: String,
    id: Number
})

const generateId = () => {
    min = Math.ceil(10);
    max = Math.floor(100000000);
    return Math.floor(Math.random() * (max - min)) + min;
}

if (process.argv.length > 3) {
    let name = process.argv[2];
    let number = process.argv[3];
    let id = generateId();
    const person = new Person({
        name: name,
        number: number,
        id: id
    })
    person
        .save()
        .then(response => {
            console.log('lisätään henkilö ' + name + ' numero ' + number + ' luetteloon')
            mongoose.connection.close()
        })
} else {
    Person
        .find({})
        .then(result => {
            console.log('Puhelinluettelo:')
            result.forEach(person => {
                console.log(person.name + " " + person.number)
            })
            mongoose.connection.close()
        })
}





