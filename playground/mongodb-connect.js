const MongoClient = require('mongodb').MongoClient;

MongoClient.connect('mongodb://localhost:27017/TodoApp', (err, db) => {
    if (err) {
        return console.log('Unable to connext to MongoDB');
    }
    console.log('Connected to MongoDB server');

    db.close();
});
