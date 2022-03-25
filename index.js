const express = require('express');
const app = express();
const morgan = require('morgan');
const cors = require('cors');
app.use(express.json());
app.use(cors());
app.use(express.static('build'));

const requestLogger = (req, res, next) => {
    console.log(`${req.method} request for '${req.url}' - ${JSON.stringify(req.body)}`);
    next();
};

app.use(requestLogger);
app.use(morgan('tiny'));

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
    res.json(data);
});

app.get('/info', (req, res) => {
    const date = new Date();
    const info = `<p>Phonebook has info for ${data.length} people</p>
    <p>${date}</p>`;
    res.send(info);
});

app.get('/api/persons/:id', (req, res) => {
    const id = Number(req.params.id);
    const person = data.find(person => person.id === id);
    if (person) {
        res.json(person);
    } else {
        res.status(404).end();
    }
});

app.delete('/api/persons/:id', (req, res) => {
    const id = Number(req.params.id);
    const person = data.find(person => person.id === id);
    if (person) {
        data = data.filter(person => person.id !== id);
        res.status(204).end();
    } else {
        res.status(404).end();
    }
});

app.post('/api/persons', (req, res) => {
    const body = req.body;
    if (!body.name || !body.number) {
        return res.status(400).json({
            error: 'name or number missing'
        });
    }
    if (data.find(person => person.name === body.name)) {
        return res.status(400).json({
            error: 'name must be unique'
        });
    }
    const person = {
        id: Math.floor(Math.random() * 100000),
        name: body.name,
        number: body.number
    };
    data = data.concat(person);
    res.json(person);
});


const PORT = process.env.PORT || 3001;

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});