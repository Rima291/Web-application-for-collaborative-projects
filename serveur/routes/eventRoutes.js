const express = require('express');
const router = express.Router();
const Event = require('../models/Event');

router.use(express.json());

router.get('/', async (req, res) => {
  try {
    const events = await Event.find();
    res.json(events);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.post('/', async (req, res) => {
  const event = new Event({
    title: req.body.title,
    start: req.body.start,
    end: req.body.end,
  });
  try {
    const newEvent = await event.save();
    res.status(201).json(newEvent);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});
router.delete('/delete/:id', async (req, res) => {
    try {
      await Event.findByIdAndDelete(req.params.id); // Modifier ici
      res.json({ message: 'Deleted event' });
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  });
  



module.exports = router;
