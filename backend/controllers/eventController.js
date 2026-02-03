
const asyncHandler = require('express-async-handler');
const Event = require('../models/Event');

// @desc    Récupérer tous les événements
// @route   GET /api/events
// @access  Private
const getEvents = asyncHandler(async (req, res) => {
  const events = await Event.find({}).sort({ date: 1 }); // Tri par date croissante
  res.json({ data: events });
});

// @desc    Créer un événement
// @route   POST /api/events
// @access  Private (Admin/Commission)
const createEvent = asyncHandler(async (req, res) => {
  const { title, type, date, time, location, organizingCommission, description } = req.body;

  const event = new Event({
    title,
    type,
    date,
    time,
    location,
    organizingCommission,
    description
  });

  const createdEvent = await event.save();
  res.status(201).json(createdEvent);
});

// @desc    Mettre à jour un événement
// @route   PUT /api/events/:id
// @access  Private (Admin)
const updateEvent = asyncHandler(async (req, res) => {
  const event = await Event.findById(req.params.id);

  if (event) {
    event.title = req.body.title || event.title;
    event.date = req.body.date || event.date;
    event.location = req.body.location || event.location;
    event.status = req.body.status || event.status;
    
    const updatedEvent = await event.save();
    res.json(updatedEvent);
  } else {
    res.status(404);
    throw new Error('Événement non trouvé');
  }
});

// @desc    Supprimer un événement
// @route   DELETE /api/events/:id
// @access  Private (Admin)
const deleteEvent = asyncHandler(async (req, res) => {
  const event = await Event.findById(req.params.id);

  if (event) {
    await event.deleteOne();
    res.json({ message: 'Événement supprimé' });
  } else {
    res.status(404);
    throw new Error('Événement non trouvé');
  }
});

module.exports = {
  getEvents,
  createEvent,
  updateEvent,
  deleteEvent
};
