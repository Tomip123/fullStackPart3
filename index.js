const express = require('express');
const app = express();
const morgan = require('morgan');
const cors = require('cors');
const Person = require('./modules/personCode');


app.use(express.json());
app.use(express.static('build'));
app.use(express.static('public'));

const requestLogger = (req, res, next) => {
    console.log(`${req.method} request for '${req.url}' - ${JSON.stringify(req.body)}`);
    next();
};

app.use(requestLogger);
app.use(morgan('tiny'));

const errorHandler = (error, req, res, next) => {
    console.error(error.message);
    if (error.name === 'CastError') {
        return res.status(400).json({ error: 'malformatted id' });
    } else if (error.name === 'ValidationError') {
        return res.status(400).json({ error: error.message });
    }
};

let data = [
    {
        "id": 1,
        "name": "Arto Hellas",
        "number": "040-123456"
    },
    {
        "id": 2,
        "name": "Ada Lovelace",
        "number": "39-44-5323523"
    },
    {
        "id": 3,
        "name": "Dan Abramov",
        "number": "12-43-234345"
    },
    {
        "id": 4,
        "name": "Mary Poppendieck",
        "number": "39-23-6423122"
    }
]


app.get('/api/persons', (req, res) => {
    Person.find({}).then(result => {
        res.json(result);
    });
});

app.get('/api/persons/info', (req, res) => {
    const date = new Date();
    Person.find({}).then(result => {
        res.send(`<p>Phonebook has info for ${result.length} people</p><p>${date}</p>`);
    });
});

app.get('/api/persons/:id', (req, res, next) => {
    const id = req.params.id;
    Person.findById(id).then(result => {
        res.json(result);
    })
        .catch(error => next(error));   
});

app.delete('/api/persons/:id', (req, res, next) => {
    const id = req.params.id;
    Person.findByIdAndRemove(id).then(result => {
        if (result) {
            res.status(204).end();
        } else {
            res.status(404).json({ error: 'No person with given id' });
        }
    })
        .catch(error => next(error));
});

app.put('/api/persons/:id', (req, res, next) => {
    Person.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true })
        .then(result => {
            res.json(result);
        })
        .catch(error => next(error));
});

app.post('/api/persons', (req, res, next) => {
    const body = req.body;
    const person = new Person({
        name: body.name,
        number: body.number,
    });
    person.save()
        .then(result => {
            data.concat(result);
            res.json(result);
        })
        .catch(error => next(error));
});

app.use(errorHandler);

const PORT = process.env.PORT

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});