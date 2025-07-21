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
  console.log('Webhook triggered');
  console.log('Request headers:', req.headers);
  console.log('Request body:', req.body);

  try {
    const db = client.db('EVAT'); // Check your DB name here
    const collection = db.collection('user_responses'); // Check your collection name here

    if (!req.body || Object.keys(req.body).length === 0) {
      console.log('No data received');
      return res.status(400).json({ message: 'No data provided' });
    }

    const result = await collection.insertOne(req.body);
    console.log('Data saved to MongoDB with ID:', result.insertedId);
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
