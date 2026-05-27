const express     = require('express');
const router      = express.Router();
const authMW      = require('../middleware/auth');
const Participant = require('../models/Participant');
const Subscriber  = require('../models/Subscriber');
const Event       = require('../models/Event');

/* POST /api/participants – public (register for event) */
router.post('/', async (req, res) => {
  const { eventId, name, email } = req.body;
  if (!eventId || !name || !email)
    return res.status(400).json({ error: 'eventId, name and email are required.' });

  try {
    // Verify event exists and is upcoming
    const ev = await Event.findById(eventId);
    if (!ev)           return res.status(404).json({ error: 'Event not found.' });
    if (ev.type !== 'upcoming')
      return res.status(400).json({ error: 'Registration is closed for past events.' });

    // Check duplicate registration
    const dup = await Participant.findOne({ eventId, email: email.toLowerCase() });
    if (dup) return res.status(409).json({ error: 'You are already registered for this event.' });

    // Save participant
    const participant = await Participant.create({ eventId, eventTitle: ev.title, name, email });

    // Increment registrations counter on the event
    await Event.findByIdAndUpdate(eventId, { $inc: { registrations: 1 } });

    // Auto-subscribe email if not already subscribed
    const existingSub = await Subscriber.findOne({ email: email.toLowerCase() });
    if (!existingSub) {
      await Subscriber.create({ email: email.toLowerCase() });
    } else if (!existingSub.active) {
      existingSub.active = true;
      await existingSub.save();
    }

    res.status(201).json({ message: 'Registered successfully!', participant });
  } catch (e) {
    res.status(400).json({ error: e.message });
  }
});

/* GET /api/participants – admin (all, optionally filtered by eventId) */
router.get('/', authMW, async (req, res) => {
  try {
    const filter = req.query.eventId ? { eventId: req.query.eventId } : {};
    const participants = await Participant.find(filter).sort({ createdAt: -1 });
    res.json(participants);
  } catch (e) { res.status(500).json({ error: e.message }); }
});

/* GET /api/participants/count – admin (count per event) */
router.get('/count', authMW, async (req, res) => {
  try {
    const counts = await Participant.aggregate([
      { $group: { _id: '$eventId', count: { $sum: 1 }, eventTitle: { $first: '$eventTitle' } } }
    ]);
    res.json(counts);
  } catch (e) { res.status(500).json({ error: e.message }); }
});

/* DELETE /api/participants/:id – admin */
router.delete('/:id', authMW, async (req, res) => {
  try {
    const p = await Participant.findByIdAndDelete(req.params.id);
    if (!p) return res.status(404).json({ error: 'Participant not found.' });
    await Event.findByIdAndUpdate(p.eventId, { $inc: { registrations: -1 } });
    res.json({ message: 'Removed.' });
  } catch (e) { res.status(500).json({ error: e.message }); }
});

module.exports = router;
