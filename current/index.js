const express = require('express');
const mongoose = require('mongoose');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware to parse JSON request bodies
app.use(express.json());

// Define a Mongoose schema (model)
const itemSchema = new mongoose.Schema({
    name: String,
    description: String,
    // Add other fields as needed
});

const Item = mongoose.model('Item', itemSchema); // 'Item' is the collection name

// MongoDB Connection
let uri = process.env.MONGODB_URI
console.log("uri", uri)
const MONGODB_URI = uri || 'mongodb://mongodb:27017/mydatabase';
let cd = new Date().getTime();

// setInterval(() => {
// console.log('cd', new Date().getTime())
// }, 10)
mongoose.connect(MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
}).then(() => {
    console.log('Connected to MongoDB');
}).catch((err) => {
    console.error('MongoDB connection error:', err);
});

// Routes
app.get('/', (req, res) => {
    console.log('index!!', req.query.type)
    res.send({status: 'xx222xx', MONGODB_URI, cd})
})
// Create a new item
app.post('/items', async (req, res) => {
    try {
        const newItem = new Item(req.body); // Create a new Item document
        const savedItem = await newItem.save(); // Save to the database
        res.status(201).json(savedItem); // Send back the saved item (status 201 Created)
    } catch (err) {
        console.error("Error creating item:", err);
        res.status(500).json({ error: 'Failed to create item' }); // Send error response
    }
});


// Create a new item
app.get('/create', async (req, res) => {
    try {
        const newItem = new Item(req.query); // Create a new Item document
        const savedItem = await newItem.save(); // Save to the database
        res.status(201).json(savedItem); // Send back the saved item (status 201 Created)
    } catch (err) {
        console.error("Error creating item:", err);
        res.status(500).json({ error: 'Failed to create item' }); // Send error response
    }
});

// Get all items
app.get('/items', async (req, res) => {
    try {
        const items = await Item.find(); // Find all items
        res.json(items); // Send back the items
    } catch (err) {
        console.error("Error getting items:", err);
        res.status(500).json({ error: 'Failed to get items' });
    }
});

// Get a single item by ID
app.get('/items/:id', async (req, res) => {
    try {
        const item = await Item.findById(req.params.id);
        if (!item) {
            return res.status(404).json({ error: 'Item not found' }); // Handle not found
        }
        res.json(item);
    } catch (err) {
        console.error("Error getting item:", err);
        res.status(500).json({ error: 'Failed to get item' });
    }
});


// Update an item
app.put('/items/:id', async (req, res) => {
    try {
        const updatedItem = await Item.findByIdAndUpdate(req.params.id, req.body, { new: true }); // new: true returns the updated item
        if (!updatedItem) {
            return res.status(404).json({ error: 'Item not found' });
        }
        res.json(updatedItem);
    } catch (err) {
        console.error("Error updating item:", err);
        res.status(500).json({ error: 'Failed to update item' });
    }
});


// Delete an item
app.delete('/items/:id', async (req, res) => {
    try {
        const deletedItem = await Item.findByIdAndDelete(req.params.id);
        if (!deletedItem) {
            return res.status(404).json({ error: 'Item not found' });
        }
        res.status(204).end(); // 204 No Content for successful delete
    } catch (err) {
        console.error("Error deleting item:", err);
        res.status(500).json({ error: 'Failed to delete item' });
    }
});


app.listen(PORT, () => {
    console.log(`!!! Server listening on port ${PORT}`);
});