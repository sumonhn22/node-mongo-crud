const express = require('express');
const bodyParser=require('body-parser');
const ObjectId = require('mongodb').ObjectId;

const MongoClient = require('mongodb').MongoClient;
const password = 'Waepqn1Ca8retKGV';

const uri = "mongodb+srv://sumondb:Waepqn1Ca8retKGV@cluster0.6yzgj.mongodb.net/test1?retryWrites=true&w=majority";
const client = new MongoClient(uri, { useNewUrlParser: true,  useUnifiedTopology: true});

const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false}));

app.get('/', (req, res) => {
    res.sendFile(__dirname + '/index.html');
})

client.connect(err => {
  const productCollection = client.db("test1").collection("product");
  // const product = {name: "Honey", price: 100, quantity: 50};
  //app.post("/addProduct", (req, res) => {
  //  collection.insertOne(product)
   // .then( result => {
     // console.log("one product ")
 // })
 
 // })
//  console.log("connection")
  // perform actions on the collection object

  app.get('/products', (req, res) => {
      productCollection.find({})
      .toArray((err, documents) => {
        res.send(documents);  
      })
  })

  app.get('/product/:id', (req, res) =>{
    productCollection.find({_id: ObjectId(req.params.id)})
    .toArray((err, documents) => {
      res.send(documents[0]);
    })
  })

  app.post("/addProduct", (req, res) => {
      const product=req.body;
      productCollection.insertOne(product)
      .then(result => {
         // console.log('data added');
          res.redirect('/')
          // res.send('Add success');
      });
  });
 
  app.patch('/update/:id', (req, res) => {
    productCollection.updateOne({_id: ObjectId(req.params.id)},
    {
      $set: {price: req.body.price, quantity: req.body.quantity}
    })
    .then(result => {
      res.send(result.modifiedCount > 0);
      // console.log(result);
})
  })

  app.delete('/delete/:id', (req, res) => {
      productCollection.deleteOne({_id: ObjectId(req.params.id)})
      .then(result => {
           //   console.log(result);
           res.send(result.deletedCount > 0);
      })
      
  })
 
});

app.listen(4000);