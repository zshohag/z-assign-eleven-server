const  express = require('express')
const { MongoClient } = require('mongodb');

const ObjectId = require('mongodb').ObjectId

const bodyParser = require("body-parser")

const cors = require('cors');
const { urlencoded } = require('body-parser');
require('dotenv').config()

const app = express()
const port = process.env.PORT || 5000;


// middlewire

app.use(cors());
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));


const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.pdjev.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

console.log(uri)


async function run() {
    try {
      await client.connect();
      console.log('Database Connected')
      const database = client.db("hungry_takeout");
      const foodsCollection = database.collection("foods");
      const orderCollection = database.collection('orders')


      // ADD ORDER FROM USER

      app.post('/orders', async(req,res)=> {
        const order = req.body
        console.log( 'order' , order)
        res.send('order processed')
    })
     
      //GET API  

        app.get('/foods' , async(req,res)=> {
        const cursor = foodsCollection.find({})
        const foods = await cursor.toArray()
        res.send(foods)
    })

           // GET SINGLE FOOD

           app.get('/foods/:id' , async (req,res) => {
             
            const id = req.params.id
            console.log(' Getting Specific Service ' ,id)
            const query = {_id : ObjectId(id) }
            const food = await foodsCollection.findOne(query)
            res.json(food)
       })
   
      // POST API 
      app.post('/order', async (req,res)=> {

          const food = req.body
          const result =  await orderCollection.insertOne(food)
          console.log(result)
          res.json(result)
        
      });

       // GET API

        app.get("/orders/:email", async (req, res) => {
          const result = await orderCollection.find({
            email: req.params.email,
          }).toArray();

          res.send(result);
        });
      
     } 
    
    finally {
      //await client.close();
    }
  }

  run().catch(console.dir);



  
app.get('/', (req,res)=> {
res.send('z')
})


app.listen(port , () => {
console.log(' Z, Running Server on port ' ,port)
})
