
const express = require('express')
const app = express()

const MongoClient = require('mongodb').MongoClient;
const cors = require('cors');
const bodyparser = require('body-parser');
require('dotenv').config();
const ObjectID = require('mongodb').ObjectID
const port = process.env.PORT || 5000;
console.log(process.env.DB_USER);

app.use(cors());
app.use(bodyparser.json());

app.get('/', (req, res) => {
  res.send('Hello World! this is working')
})


const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.37eim.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`;
console.log(uri)
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
client.connect(err => {

  const SellerProductCollection = client.db("Bariwala").collection("sellerProductInfo");
  const UserCollection = client.db("Bariwala").collection("UserRegistration");
  const AdminCollection = client.db("Bariwala").collection("AdminRegistration");

  // perform actions on the collection object
  console.log("Connected successfully")


  //Db for adding Services
  app.post('/addServices', (req, res) => {
    console.log("er ", err)
    const newService = req.body;
    console.log("New Event: ", newService);
    SellerProductCollection.insertOne(newService)
      .then(result => {
        //  console.log("Inserted succesfully ", result.insertedCount);
        res.send(result.insertedCount > 0);
      })
  })
  //Db to get services
  app.get('/getServices', (req, res) => {

    SellerProductCollection.find().toArray((err, items) => {
      console.log("Error ", err)
      res.send(items)
      //  console.log("database ", items)
    })
  })


  //Db for adding Users
  app.post('/addUsers', (req, res) => {
    console.log("er ", err)
    const newUser = req.body;
    console.log("New Event: ", newUser);
    UserCollection.insertOne(newUser)
      .then(result => {
        //  console.log("Inserted succesfully new Usre ", result.insertedCount);
        res.send(result.insertedCount > 0);
      })
  })


  //Db for adding Admin
  app.post('/addAdmin', (req, res) => {
    console.log("er ", err)
    const newUser = req.body;
    console.log("New Event: ", newUser);
    AdminCollection.insertOne(newUser)
      .then(result => {
        console.log("Inserted succesfully new admin ", result.insertedCount);
        res.send(result.insertedCount > 0);
      })
  })

  //Db for getting Users all
  app.get('/getUser/:email', (req, res) => {
    const email = req.params.email;
    console.log("email ", email)
    const query = { Email: email }
    console.log("query ", query)
    AdminCollection.find({ Email: email }).toArray((err, item) => {
      console.log("Error ", err)
      console.log("item user", item)
      if (item.length > 0) {
        res.send(item)
      } else {
        UserCollection.find({ Email: email }).toArray((err, itemAdmin) => {
          console.log("Error ", err)
          console.log("item admin", itemAdmin.length)
          res.send(itemAdmin)
        }
        )
        //  console.log("databaseOneItem user ", item)
      }
    })
  })


  
  //Db for getting Users Seller
  app.get('/getSeller/:email', (req, res) => {
    const email = req.params.email;
    console.log("email ", email)
    const query = { Email: email }
    console.log("query ", query)
    UserCollection.find({ Email: email }).toArray((err, item) => {
      console.log("Error ", err)
      console.log("item user", item)
        res.send(item)
        //  console.log("databaseOneItem user ", item)
      }
    )
  })
//Db for getting seller Listen
app.get('/getSeller', (req, res) => {

  UserCollection.find().toArray((err, items) => {
    console.log("Error UserCollection", err)
    res.send(items)
  })
}) 


//Db for getting sellerAdmin Listen
app.get('/getAdminList', (req, res) => {

  AdminCollection.find().toArray((err, items) => {
    console.log("Error AdminCollection", err)
    res.send(items)
  })
}) 




  // db for getting Description for one
  //Db for getting Users
  app.get('/description/:id', (req, res) => {
    const Id = ObjectID(req.params.id);
    // console.log("id ",req.params.id)
    const query = { _id: Id }
    console.log("query ", query)
    SellerProductCollection.find({ _id: Id }).toArray((err, item) => {
      console.log("Error ", err)
      res.send(item)
      console.log("databaseOneItem user ", item)
    })
  })
  //seller history with product
  app.get('/getUser/history/:email', (req, res) => {
    const email = req.params.email;
    console.log("email ", email)
    const query = { Email: email }
    console.log("query ", query)
    SellerProductCollection.find({ sellerEmail: email }).toArray((err, item) => {
      console.log("Error ", err)
      console.log("history item user", item)
      res.send(item)
    })
  })

  //update status
  app.patch('/product/update/:id', (req, res)=>{
    SellerProductCollection.updateOne( {_id: ObjectID(req.params.id)},
    {
      $set:{status: req.body.Status}
    }
    ) 
    .then(result=>{
       console.log("rslt ",result)
       res.result
    })
  })

});











app.listen(port, () => {
  console.log(`Example app listening at http:/localhost:${port}`)
})

