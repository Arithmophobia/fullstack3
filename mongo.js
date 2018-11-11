const mongoose = require('mongoose')

// korvaa url oman tietokantasi urlilla. ethän laita salasanaa Githubiin!
const url = 'mongodb://fullstack:????@ds159073.mlab.com:59073/fullstack-persons'

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





