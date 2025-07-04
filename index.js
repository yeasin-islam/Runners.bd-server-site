const express = require("express");
const cors = require("cors");
const app = express();
const port = process.env.PORT || 3000;

const admin = require("firebase-admin");
const serviceAccount = require("./firebase-admin-service-key.json");

const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
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

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

const verifyFirebaseToken = async (req, res, next) => {
  const authHeader = req.headers?.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).send({ message: "unauthorized access" });
  }
  const token = authHeader.split(" ")[1];

  try {
    const decoded = await admin.auth().verifyIdToken(token);
    console.log("Decoded token: ", decoded);
    req.decoded = decoded;

    next();
  } catch (error) {
    return res.status(401).send({ message: "unauthorized access" });
  }
};

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    // await client.connect();

    const marathonsCollection = client
      .db("marathonsDB")
      .collection("marathons");

    const registrationCollaction = client
      .db("marathonsDB")
      .collection("registrations");
    const reviewCollaction = client
      .db("marathonsDB")
      .collection("reviews");

    app.post("/marathons", async (req, res) => {
      const marathon = req.body;
      // console.log(marathon);
      const result = await marathonsCollection.insertOne(marathon);
      res.send(result);
    });
    app.post("/reviews", async (req, res) => {
      const review = req.body;
      // console.log(review);
      const result = await reviewCollaction.insertOne(review);
      res.send(result);
    });

    app.post("/registrations", async (req, res) => {
      const registration = req.body;
      // console.log(registration);
      const result = await registrationCollaction.insertOne(registration);
      res.send(result);
    });

    app.get("/my-applications", verifyFirebaseToken, async (req, res) => {
      const email = req.query.applicantEmail;

      if (email !== req.decoded.email) {
        return res.status(403).message({ message: "forbidden access" });
      }

      // console.log("req header", req.headers);

      if (!email) {
        return res
          .status(400)
          .send({ error: "applicantEmail query param is required" });
      }

      try {
        const result = await registrationCollaction
          .find({ applicantEmail: email })
          .toArray();

        for (const registration of result) {
          const marathonId = registration.marathonId;
          const marathonQuery = { _id: new ObjectId(marathonId) };
          const marathon = await marathonsCollection.findOne(marathonQuery);

          if (marathon) {
            registration.location = marathon.location;
            registration.title = marathon.title;
            registration.photo = marathon.photo;
            registration.distance = marathon.distance;
            registration.marathonDate = marathon.marathonDate;
          }
        }

        res.send(result);
      } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Failed to fetch result" });
      }
    });

    app.get("/my-marathons", verifyFirebaseToken, async (req, res) => {
      const { email } = req.query;

      if (email !== req.decoded.email) {
        return res.status(403).message({ message: "forbidden access" });
      }

      if (!email) {
        return res.status(400).json({ message: "Email is required" });
      }

      try {
        const marathons = await marathonsCollection
          .find({ creatBy: email })
          .toArray();

        res.send(marathons);
      } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Failed to fetch marathons" });
      }
    });

    app.get("/marathons",verifyFirebaseToken, async (req, res) => {
      const cursor = marathonsCollection.find();
      const result = await cursor.toArray();
      res.send(result);
    });
    app.get("/reviews", async (req, res) => {
      const cursor = reviewCollaction.find();
      const result = await cursor.toArray();
      res.send(result);
    });

    app.get("/marathons/:id",verifyFirebaseToken, async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const result = await marathonsCollection.findOne(query);
      res.send(result);
    });

    app.get("/marathons-section-posts", async (req, res) => {
      try {
        const marathons = await marathonsCollection
          .find({
              distance: { $in: ["10K", "25K"] },
          })
          .limit(6)
          .toArray();

        res.send(marathons);
      } catch (err) {
        console.error("Failed to fetch marathons section posts", err);
        res.status(500).send({ error: "Internal Server Error" });
      }
    });

    app.delete("/marathons/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const result = await marathonsCollection.deleteOne(query);
      res.send(result);
    });
    app.delete("/applications/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const result = await registrationCollaction.deleteOne(query);
      res.send(result);
    });

    app.get("/applications/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const result = await registrationCollaction.findOne(query);
      res.send(result);
    });
    app.get("/applications/marathon/:marathon_id", verifyFirebaseToken, async (req, res) => {
      const marathon_id = req.params.marathon_id;
      const query = { marathonId: marathon_id };
      const result = await registrationCollaction.find(query).toArray();
      res.send(result);
    });

    app.put("/applications/:id", async (req, res) => {
      const id = req.params.id;
      const filter = { _id: new ObjectId(id) };
      options = { upsert: true };
      const updatedApplication = req.body;
      const updatedDoc = {
        $set: updatedApplication,
      };
      const result = await registrationCollaction.updateOne(
        filter,
        updatedDoc,
        options
      );
      res.send(result);
    });

    app.put("/marathons/:id", async (req, res) => {
      const id = req.params.id;
      const filter = { _id: new ObjectId(id) };
      options = { upsert: true };
      const updatedMarathon = req.body;
      const updatedDoc = {
        $set: updatedMarathon,
      };
      const result = await marathonsCollection.updateOne(
        filter,
        updatedDoc,
        options
      );
      res.send(result);
    });

    // Send a ping to confirm a successful connection
    // await client.db("admin").command({ ping: 1 });
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
  res.send("This is Marathon Management System web server");
});

app.listen(port, (req, res) => {
  console.log(
    `This is Marathon Management System web server running on port ${port}`
  );
});
