const express = require('express');
const router = express.Router();

// @GET /api/equipment
router.get('/', (req, res) => {
  try {
    res.json({ equipment: [] });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// @POST /api/equipment
router.post('/', (req, res) => {
  try {
    res.status(201).json({ message: 'Equipment created' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// @GET /api/equipment/:id
router.get('/:id', (req, res) => {
  try {
    res.json({ equipment: null });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// @PUT /api/equipment/:id
router.put('/:id', (req, res) => {
  try {
    res.json({ message: 'Equipment updated' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;