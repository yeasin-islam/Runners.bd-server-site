const express = require("express");
const cors = require("cors");
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
const app = express();
const port = process.env.PORT || 3000;
require("dotenv").config();

// meddlewair
app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.p1d61hg.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    await client.connect();

     const marathonsCollection = client.db("marathonsDB").collection("marathons");

     app.post("/marathons", async (req, res) => {
      const marathon = req.body;
      // console.log(marathon);
      const result = await marathonsCollection.insertOne(marathon);
      res.send(result);
    });

    app.get("/marathons", async (req, res) => {
      const cursor = marathonsCollection.find();
      const result = await cursor.toArray();
      res.send(result);
    })

    app.get("/marathons/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const result = await marathonsCollection.findOne(query);
      res.send(result);
    })

    app.get("/my-marathons", async (req, res) => {
      const userEmail = req.query.email;

      if (!userEmail) {
        return res.status(400).json({ error: "Email is required" });
      }

      try {
        const myMarathons = await marathonsCollection
          .find({ email: userEmail })
          .toArray();
        res.send(myMarathons);
      } catch (error) {
        res.status(500).json({ error: "Server Error" });
      }
    });

    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log(
      "Pinged your deployment. You successfully connected to MongoDB!"
    );
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);

app.get("", (req, res) => {
  res.send("This is Marathon Management System web serber");
});

app.listen(port, (req, res) => {
  console.log(`This is Marathon Management System web server running on port ${port}`);
});
