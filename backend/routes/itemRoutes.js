const express = require('express');
const Item = require('../models/Item');
const authMiddleware = require('../middleware/authMiddleware');

const router = express.Router();

// Search items
// GET /api/items/search?name=xyz
router.get('/search', async (req, res) => {
  try {
    const { name, type } = req.query;
    let query = {};
    if (name) {
      query.itemName = { $regex: name, $options: 'i' };
    }
    if (type) {
      query.type = type;
    }
    const items = await Item.find(query).populate('createdBy', 'name email').sort({ date: -1 });
    res.json(items);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// Get all items
// GET /api/items
router.get('/', async (req, res) => {
  try {
    const items = await Item.find().populate('createdBy', 'name email').sort({ date: -1 });
    res.json(items);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// Get item by ID
// GET /api/items/:id
router.get('/:id', async (req, res) => {
  try {
    const item = await Item.findById(req.params.id).populate('createdBy', 'name email');
    if (!item) {
      return res.status(404).json({ message: 'Item not found' });
    }
    res.json(item);
  } catch (err) {
    console.error(err.message);
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ message: 'Item not found' });
    }
    res.status(500).send('Server error');
  }
});

// Create item
// POST /api/items (Protected)
router.post('/', authMiddleware, async (req, res) => {
  try {
    const { itemName, description, type, location, contactInfo } = req.body;

    const newItem = new Item({
      itemName,
      description,
      type,
      location,
      contactInfo,
      createdBy: req.user.id
    });

    const item = await newItem.save();
    res.json(item);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// Update item
// PUT /api/items/:id (Protected, Owner only)
router.put('/:id', authMiddleware, async (req, res) => {
  try {
    let item = await Item.findById(req.params.id);

    if (!item) {
      return res.status(404).json({ message: 'Item not found' });
    }

    // Check ownership
    if (item.createdBy.toString() !== req.user.id) {
      return res.status(401).json({ message: 'User not authorized to update this item' });
    }

    const { itemName, description, type, location, contactInfo } = req.body;

    item = await Item.findByIdAndUpdate(
      req.params.id,
      { $set: { itemName, description, type, location, contactInfo } },
      { new: true }
    );

    res.json(item);
  } catch (err) {
    console.error(err.message);
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ message: 'Item not found' });
    }
    res.status(500).send('Server error');
  }
});

// Delete item
// DELETE /api/items/:id (Protected, Owner only)
router.delete('/:id', authMiddleware, async (req, res) => {
  try {
    const item = await Item.findById(req.params.id);

    if (!item) {
      return res.status(404).json({ message: 'Item not found' });
    }

    // Check ownership
    if (item.createdBy.toString() !== req.user.id) {
      return res.status(401).json({ message: 'User not authorized to delete this item' });
    }

    await Item.findByIdAndDelete(req.params.id);

    res.json({ message: 'Item removed' });
  } catch (err) {
    console.error(err.message);
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ message: 'Item not found' });
    }
    res.status(500).send('Server error');
  }
});

module.exports = router;
