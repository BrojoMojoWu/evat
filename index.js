// index.js
const express = require('express');
const { MongoClient } = require('mongodb');
const cors = require('cors');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

const uri = process.env.MONGO_URI;
const client = new MongoClient(uri);

async function connectClient() {
  try {
    await client.connect();
    console.log('Connected to MongoDB');
  } catch (err) {
    console.error('MongoDB connection error:', err);
  }
}

connectClient();

app.post('/api/save', async (req, res) => {
  try {
    const db = client.db('EVAT'); // Change if your DB name is different
    const collection = db.collection('user_responses'); // Change if your collection name is different

    // Basic validation example (optional)
    if (!req.body || Object.keys(req.body).length === 0) {
      return res.status(400).json({ message: 'No data provided' });
    }

    const result = await collection.insertOne(req.body);
    res.status(200).json({ message: 'Data saved successfully', id: result.insertedId });
  } catch (err) {
    console.error('Error saving data:', err);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});

app.get('/', (req, res) => {
  res.send('EV Usage Insights API is live!');
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
