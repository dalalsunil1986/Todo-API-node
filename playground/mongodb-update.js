//const MongoClient = require('mongodb').MongoClient;
const { MongoClient, ObjectID } = require('mongodb');

MongoClient.connect('mongodb://localhost:27017/TodoApp', (err, client) => {
    if (err) {
        return console.log('Unable to connext to MongoDB');
    }
    console.log('Connected to MongoDB server');
    const db = client.db('TodoApp');

    /*db.collection('Todos').findOneAndUpdate(
        {
            _id: new ObjectID('5ba95fc1173c080f93d8e756')
        }, {
            $set: {
                completed: true
            }
        }, {
            returnOriginal: false
        }).then(result => {
            console.log(result);
        });*/

    db.collection('Users').findOneAndUpdate(
        {
            _id: new ObjectID('5ba95146522a176261422062')
        }, {
            $inc: { age: 1 }
        }, {
            returnOriginal: false
        }).then(result => {
            console.log(result);
        });

    //client.close();
});
