const express = require('express');
const cors = require('cors');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 7000;

// Middleware
app.use(cors());
app.use(express.json());

// MongoDB URI and Client Setup
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.nb7zkyq.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

// Helper function to validate MongoDB ObjectId
function isValidObjectId(id) {
  return ObjectId.isValid(id) && String(new ObjectId(id)) === id;
}

// Connect to MongoDB and set up routes
async function run() {
  try {
    // await client.connect();
    // console.log("MongoDB connected");

    // Collections
    const cardCollection = client.db('Countries').collection('countriedcard');
    const experienceCollection = client.db('Countries').collection('travelExperiences');
    const countriesCollection = client.db('Countries').collection('touristPlace');
    const myspotsCollection = client.db('Countries').collection('myspots');
    const savedata = client.db('Countries').collection('saveSpotData');
    const countriesnameCollection = client.db('Countries').collection('countriesName');
    const spotsCollection = client.db('Countries').collection("touristSpots");
    










    // countries
    app.get('/touristPlace', async (req, res) => {
      const cursor = countriesCollection.find();
      const result = await cursor.toArray();
      res.send(result);
    });
    // countries name
    app.get('/countriesName', async (req, res) => {
      const cursor = countriesnameCollection.find();
      const result = await cursor.toArray();
      res.send(result);
    });
    // Fetch all cards
    app.get('/countriedcard', async (req, res) => {
      console.log("Received request at /countriedcard");
      try {
          const cursor = cardCollection.find();
          const result = await cursor.toArray();
          console.log("Data fetched from DB:", result);
          res.send(result);
      } catch (error) {
          console.error("Error fetching data:", error);
          res.send({ message: "Failed to fetch data" });
      }
  });
  
    


    //  Get a single spot by ID
    app.get("/countriedcard/:id", async (req, res) => {
      try {
        const { id } = req.params;
        console.log(id);
        const spot = await cardCollection.findOne({ _id: id });
        console.log(spot);

        if (!spot) {
          return res.status(404).json({ message: "Spot not found" });
        }
        res.json(spot);
      } catch (error) {
        console.error("Error fetching spot:", error);
        res.status(500).json({ message: "Server error" });
      }
    });



// Add to list operation
app.get('/countriedcard/:id', async(req, res) =>{
  const id = req.params.id;
  const query = {_id: new ObjectId(id)}
  const options = {
    projection: {title: 1, price: 1, 
      country_name: 1, image: 1},

  };
  const result = cardCollection.findOne(query, options);
  res.send(result);
})

// Define the POST route
app.post('/countriedcard', (req, res) => {
  const data = req.body;
  console.log(data); // Process the incoming data
  res.status(200).send({ message: 'Data received successfully' });
});




//  saving form data

    // Travel Experience: Fetch all experiences
    app.get('/travelExperiences', async (req, res) => {
      const cursor = experienceCollection.find();
      const result = await cursor.toArray();
      res.send(result);
    });

    // Travel Experience: Add a new experience
    app.post('/travelExperiences', async (req, res) => {
      const newExperience = req.body; // Expecting an object with user experience details
      if (!newExperience.name || !newExperience.review || !newExperience.image) {
        return res.status(400).send({ message: "Name, review, and image are required" });
      }

      try {
        const result = await experienceCollection.insertOne(newExperience);
        res.status(201).send({ message: "Experience added successfully", id: result.insertedId });
      } catch (error) {
        console.error("Error adding experience:", error);
        res.status(500).send({ message: "Failed to add experience" });
      }
    });

    // table for saved data
app.get('/saveSpotData', async (req, res) => {
  let query = {};
  if (req.query?.email) {
    query = { email: req.query.email };
  }
  const result = await savedata.find(query).toArray();
  res.send(result);
});

app.post('/saveSpotData', async (req, res) => {
  const booking = { ...req.body, status: 'Pending' };
  const result = await savedata.insertOne(booking);
  res.send(result);
});

app.delete('/saveSpotData/:id', async (req, res) => {
  const id = req.params.id;

  if (!ObjectId.isValid(id)) {
    return res.status(400).send({ success: false, message: 'Invalid booking ID' });
  }

  try {
    const result = await savedata.deleteOne({ _id: new ObjectId(id) });

    if (result.deletedCount > 0) {
      res.status(200).send({ success: true, message: 'Booking deleted successfully' });
    } else {
      res.status(404).send({ success: false, message: 'Booking not found' });
    }
  } catch (error) {
    console.error('Error deleting booking:', error);
    res.status(500).send({ success: false, message: 'Error deleting booking', error });
  }
});

  } catch (error) {
    console.error('Error connecting to MongoDB:', error);
    process.exit(1); // Exit the process if MongoDB connection fails
  }
}

run();

 // Search by Tourist Spot Name
//  app.get('/countriedcard', async (req, res) => {
//   const search = req.query.search || "";
//   const country = req.query.country || "";
  
//   let query = {};
//   if (search) {
//       query.tourists_spot_name = { $regex: search, $options: "i" };
//   }
//   if (country) {
//       query.country_name = country;
//   }
  
//   const spots = await cardCollection.find(query).toArray();
//   res.send(spots);
// });

// Basic Route to Check if the Server is Running
app.get('/', (req, res) => {
  res.send('Server is running');
});

// Start the server
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
