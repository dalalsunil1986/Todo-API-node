const expect = require('expect');
const request = require('supertest');

const { app } = require('./../server');
const { Todo } = require('./../models/todo');
const { ObjectId } = require('mongodb');

const todos = [{
    _id: new ObjectId(),
    text: 'First test todo'
}, {
    _id: new ObjectId(),
    text: 'Second test todo',
    completed: true,
    completedAt: 123
}]

beforeEach(done => {
    Todo.remove({}).then(() => {
        return Todo.insertMany(todos);
    }).then(() => done());
});

describe('POST /todos', () => {
    it('should create a new todo', (done) => {
        const text = 'Todo text';
        request(app)
            .post('/todos')
            .send({ text })
            .expect(201)
            .expect(res => {
                expect(res.body.text).toBe(text);
            })
            .end((err, res) => {
                if (err) {
                    return done(err);
                }
                Todo.find({ text }).then(todos => {
                    expect(todos.length).toBe(1);
                    expect(todos[0].text).toBe(text);
                    done();
                }).catch(e => done(e))
            });
    });

    it('should not create todo with invalid body data', (done => {
        request(app)
            .post('/todos')
            .send({})
            .expect(400)
            .end((err, res) => {
                if (err) {
                    return done(err);
                }
                Todo.find().then(todos => {
                    expect(todos.length).toBe(todos.length);
                    done();
                }).catch(e => done(e));
            });
    }));
});

describe('GET /todos', () => {
    it('Should get todos', (done) => {
        request(app)
            .get('/todos')
            .expect(200)
            .expect(res => {
                expect(res.body.todos.length).toBe(todos.length)
            })
            .end(done);
    });
});

describe('GET /todos/id', () => {
    it('Should get todo by id', (done) => {
        request(app)
            .get(`/todos/${todos[0]._id.toHexString()}`)
            .expect(200)
            .expect(res => {
                expect(res.body.todo.text).toBe(todos[0].text);
            })
            .end(done);
    });

    it('Should return a 404 if todo not found', (done) => {
        request(app)
            .get(`/todos/${new ObjectId().toHexString}`)
            .expect(404)
            .end(done);
    });

    it('Should return a 404 for invalid id', (done) => {
        request(app)
            .get(`/todos/123`)
            .expect(404)
            .end(done);
    });
});

describe('DELETE /todos/id', () => {
    it('Should delete todo by id', (done) => {
        const hexId = todos[0]._id.toHexString();
        request(app)
            .delete(`/todos/${hexId}`)
            .expect(200)
            .expect((res) => {
                expect(res.body.todo._id).toBe(hexId);
            })
            .end((err, res) => {
                if (err) {
                    return done(err);
                }
                Todo.findById(hexId).then(todo => {
                    expect(todo).toBeFalsy();
                    done();
                }).catch(e => done(e));
            });
    });

    it('Should return a 404 if todo not found', (done) => {
        request(app)
            .delete(`/todos/${new ObjectId().toHexString}`)
            .expect(404)
            .end(done);
    });

    it('Should return a 404 for invalid id', (done) => {
        request(app)
            .delete(`/todos/123`)
            .expect(404)
            .end(done);
    });
});

describe('PATCH /todos/id', () => {
    it('Should update the todo', done => {
        const text = 'Updated text';
        request(app)
            .patch(`/todos/${todos[0]._id.toHexString()}`)
            .send({
                text,
                completed: true
            })
            .expect(200)
            .expect(res => {
                expect(res.body.todo.completed).toBe(true);
                expect(res.body.todo.text).toBe(text);
                expect(typeof res.body.todo.completedAt).toBe('number');
            })
            .end(done);
    });

    it('Should clear completedAt when todo is not completed', done => {
        const text = 'Updated text';
        request(app)
            .patch(`/todos/${todos[1]._id.toHexString()}`)
            .send({
                text,
                completed: false
            })
            .expect(200)
            .expect(res => {
                expect(res.body.todo.text).toBe(text);
                expect(res.body.todo.completed).toBe(false);
                expect(res.body.todo.completedAt).toBeFalsy();
            })
            .end(done);
    });
});
