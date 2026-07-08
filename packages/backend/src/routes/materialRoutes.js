const express = require('express');
const router = express.Router();

// @GET /api/materials
router.get('/', (req, res) => {
  try {
    res.json({ materials: [] });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// @POST /api/materials
router.post('/', (req, res) => {
  try {
    res.status(201).json({ message: 'Material created' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// @GET /api/materials/:id
router.get('/:id', (req, res) => {
  try {
    res.json({ material: null });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// @PUT /api/materials/:id
router.put('/:id', (req, res) => {
  try {
    res.json({ message: 'Material updated' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;