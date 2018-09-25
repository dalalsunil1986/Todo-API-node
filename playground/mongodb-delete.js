//const MongoClient = require('mongodb').MongoClient;
const { MongoClient, ObjectID } = require('mongodb');

MongoClient.connect('mongodb://localhost:27017/TodoApp', (err, client) => {
    if (err) {
        return console.log('Unable to connext to MongoDB');
    }
    console.log('Connected to MongoDB server');
    const db = client.db('TodoApp');

    /*db.collection('Todos').deleteMany({ text: 'Something to do' }).then(result => {
        console.log(result)
    });*/

    /*db.collection('Todos').deleteOne({ text: 'Note' }).then(result => {
        console.log(result)
    });*/

    /*db.collection('Todos').findOneAndDelete({ text: 'Todo' }).then(result => {
        console.log(result)
    });*/

    db.collection('Users').findOneAndDelete({_id: new ObjectID('5baa980b46c542de1c06549e')}).then(result =>{
        console.log(result);
    });

    //client.close();
});
