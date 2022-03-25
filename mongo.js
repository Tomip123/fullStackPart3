const mongoose = require('mongoose');

if (process.argv.length < 3) {
    console.log('the format is: node mongo.js password Anna 040-1234556');
    process.exit(1);
}

if (process.argv.length === 5) {

    const password = process.argv[2];

    const url = `mongodb+srv://admina:${password}@cluster0.zeecn.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;

    mongoose.connect(url, { useNewUrlParser: true, useUnifiedTopology: true });

    const personSchema = new mongoose.Schema({
        name: String,
        number: String
    });

    const Person = mongoose.model('Person', personSchema);

    const person = new Person({
        name: process.argv[3],
        number: process.argv[4]
    });

    person.save().then(response => {
        // log to console "added name to number to phonebook"
        console.log(`added ${response.name} number ${response.number} to phonebook`);
        mongoose.connection.close();
    });

}

else if (process.argv.length === 3) {

    const password = process.argv[2];

    const url = `mongodb+srv://admina:${password}@cluster0.zeecn.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;

    mongoose.connect(url, { useNewUrlParser: true, useUnifiedTopology: true });

    const personSchema = new mongoose.Schema({
        name: String,
        number: String
    });

    const Person = mongoose.model('Person', personSchema);

    Person.find({}).then(result => {
        console.log("phonebook:");
        result.forEach(person => {
            console.log(person.name, person.number);
        });
        mongoose.connection.close();
    });

}
  
  
