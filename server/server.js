const mongoose = require('mongoose');

mongoose.Promise = global.Promise;
mongoose.connect('mongodb://localhost:27017/TodoApp');

const Todo = mongoose.model('Todo', {
    text: {
        type: String,
        required: true,
        minlength: 1,
        trim: true
    },
    completed: {
        type: Boolean,
        default: false
    },
    completedAt: {
        type: Number,
        default: null

    }
});

const User = mongoose.model('User', {
    email: {
        type: String,
        required: true,
        minlength: 1,
        trim: true
    }
})

const newUser = new User({
    email: "test@email.com"
});

newUser.save().then(doc => {
    console.log(`Saved user: ${JSON.stringify(doc)}`);
}).catch(e => {
    console.log(`Failed to save user: ${e}`);
});

/*const newTodo = new Todo({
    text: 'Cook dinner'
});

newTodo.save().then(doc => {
    console.log('Saved todo', doc);
}, e => {
    console.log('Unable to save todo', e);
});*/
