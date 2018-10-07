require('./config/config');
const express = require('express');
const bodyParse = require('body-parser');
const { ObjectId } = require('mongodb');
const _ = require('lodash');
const { mongoose } = require('./db/mongoose');
const { Todo } = require('./models/todo');
const { User } = require('./models/user');

const port = process.env.PORT;

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

app.get('/todos', (req, res) => {
    Todo.find().then(todos => {
        res.send({ todos });
    }).catch(e => {
        res.status(400).send(e);
    });
});

app.get('/todos/:id', (req, res) => {
    const id = req.params.id;
    if (!ObjectId.isValid(id)) {
        res.status(404).send();
    }
    Todo.findById(id).then(todo => {
        if (!todo) {
            res.status(404).send();
        }
        res.send({ todo });
    }).catch(e => {
        res.status(400).send();
    });
});

app.delete('/todos/:id', (req, res) => {
    const id = req.params.id;
    if (!ObjectId.isValid(id)) {
        res.status(404).send();
    }
    Todo.findOneAndDelete(id).then(todo => {
        if (!todo) {
            res.status(404).send();
        }
        res.send({ todo });
    }).catch(e => {
        res.status(400).send();
    });
});

app.patch('/todos/:id', (req, res) => {
    const id = req.params.id;
    const body = _.pick(req.body, ['text', 'completed']);
    if (!ObjectId.isValid(id)) {
        res.status(404).send();
    }

    if (_.isBoolean(body.completed) && body.completed) {
        body.completedAt = new Date().getTime();
    } else {
        body.completed = false;
        body.completedAt = null;
    }
    Todo.findOneAndUpdate(id, { $set: body }, { new: true }).then(todo => {
        if (!todo) {
            res.status(404).send();
        }
        res.send({ todo });
    }).catch(e => {
        res.status(400).send();
    });
});


app.listen(port, () => {
    console.log(`Server started on port ${port}`);
});

module.exports = { app };
