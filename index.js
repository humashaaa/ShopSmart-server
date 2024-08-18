const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");

const express = require("express");
const cors = require("cors");
require("dotenv").config();

const port = process.env.PORT || 5000;
const app = express();

// middleware
app.use(express.json());
app.use(
  cors({
    origin: ["http://localhost:5173", ],
    credentials: true,
  })
);




const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.wal4hcq.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;
// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

async function run() {
  try {
  
    const productCollection = client.db("shopSmart").collection("products");

    // get products
    app.get("/products", async (req, res) => {
      const result = await productCollection.find().toArray();
      res.send(result);
    });
    

 // Get all data from db for pagination
 app.get('/all-products', async (req, res) => {
  const size = parseInt(req.query.size)
  const page = parseInt(req.query.page) -1
  console.log(size, page);
  const filter = req.query.filter
  

  let query = {
    // productName: { $regex: search, $options: 'i' },
  }
  if (filter) query.category = filter
  
  const result = await productCollection.find(query).skip(page * size).limit(size).toArray()

  res.send(result)
})

 // Get all  data count from db
 app.get('/products-count', async (req, res) => {
  
  const count = await productCollection.countDocuments()

  res.send({ count })
})


  } finally {
    
  }
}
run().catch(console.dir);





app.get("/", (req, res) => {
    res.send("Hello World!");
  });
  
  app.listen(port, () => {
    console.log(`Example app listening on port ${port}`);
  });