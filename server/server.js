const express = require('express');
const bodyParse = require('body-parser');

const { mongoose } = require('./db/mongoose');
const { Todo } = require('./models/todo');
const { User } = require('./models/user');

const app = express();
app.use(bodyParse.json());

app.post('/todos', (req, res) => {
    const todo = new Todo({
        text: req.body.text
    })
    todo.save().then(doc => {
        res.status(201).send(doc);
    }).catch(e => {
        res.status(400).send(e);
    });
});

app.listen(3000, () => {
    console.log('Server started on port 3000');
});
