const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const fileUpload = require('express-fileupload');
const MongoClient = require('mongodb').MongoClient;
require('dotenv').config();

const uri = "mongodb+srv://DB-DB-DOOG-DOOG:123DBDB@cluster0.wqjmg.mongodb.net/creativeAgency?retryWrites=true&w=majority";

const app = express()

app.use(bodyParser.json());
app.use(cors());
app.use(express.static('image'));
app.use(fileUpload());
const port = 5000;

app.get('/', (req, res) => {
    res.send("Hi from db db doog doog it's working working")
})

const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
client.connect(err => {
    const userCollection = client.db("creativeAgency").collection("user-services");
    const reviewCollection = client.db("creativeAgency").collection("reviews");
    const cardCollection = client.db("creativeAgency").collection("card");
    const adminCollection = client.db("creativeAgency").collection("Admin");

    app.post('/addServices', (req, res) => {
        console.log(req.body);
        userCollection.insertOne(req.body)
            .then(result => {
                res.send(result.insertedCount > 0)
            })
    })

    app.get("/getEvents", (req, res) => {
        userCollection.find({email: req.query.email})
            .toArray((err, documents) => {
                res.send(documents)
            })
    })
    app.get("/getEventss", (req, res) => {
        userCollection.find({})
            .toArray((err, documents) => {
                res.send(documents)
            })
    })
    app.post('/addreview', (req, res) => {
        console.log(req.body);
        reviewCollection.insertOne(req.body)
            .then(results => {
                res.send(results.insertedCount > 0)
            })
    })

    app.get("/getReview", (req, res) => {
        reviewCollection.find({}).limit(6)
            .toArray((err, documents) => {
                res.send(documents)
            })
    })

    app.post('/createService', (req, res) => {
        const file = req.files.file;
        const service = req.body.service;
        const description = req.body.description;
        const newImg = file.data;
        const encImg = newImg.toString('base64');

        var image = {
            contentType: file.mimetype,
            size: file.size,
            img: Buffer.from(encImg, 'base64')
        };
        cardCollection.insertOne({ file, service, description })
            .then(result => {
                res.send(result.insertedCount > 0);
            })
        // console.log(file, service, description);
        // file.mv(`${__dirname}/image/${file.name}`, err => {
        //     if (err) {
        //         console.log(err);
        //         return res.status(500).send({ msg: 'error 404! not found!' });
        //     }
        //     return res.send({ name: file.name, path: `/${file.name}` 
        //     })
        // })

    })

    app.get('/AllCardItem', (req, res) => {
        cardCollection.find({})
            .toArray((err, documents) => {
                res.send(documents);
            })
    });

    app.post('/admin', (req, res) => {
        console.log(req.body); 
        adminCollection.insertOne(req.body)
            .then(results => {
                res.send(results.insertedCount > 0)
            })
    })

    app.post('/isAdmin', (req, res) => {
        const email = req.body.email;
        adminCollection.find({ email: email })
            .toArray((err, doctors) => {
                res.send(doctors.length > 0);
            })
    })

});


app.listen(process.env.PORT || port)
