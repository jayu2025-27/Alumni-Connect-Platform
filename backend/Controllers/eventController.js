const { Event } = require("../Models/db");
const { sendNotificationEmail } = require("../utils/emailService");

// Get all events
const getEvents = async (req, res) => {
  try {
    const events = await Event.findAll();
    res.json(events);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to fetch events" });
  }
};

// Get a single event by ID
const getEventById = async (req, res) => {
  try {
    const event = await Event.findByPk(req.params.id);
    if (!event) return res.status(404).json({ error: "Event not found" });
    res.json(event);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch event" });
  }
};

// Create a new event
const createEvent = async (req, res) => {
  try {
    const { description, link, dateTime, category } = req.body;
    const newEvent = await Event.create({ description, link, dateTime, category });

    // Trigger Notification Email (Fire and forget)
    const subject = `New Event Scheduled: ${category || 'Alumni Event'}`;
    const htmlContent = `
        <h2>New Event Scheduled</h2>
        <p>A new event has been scheduled on Alumni Connect.</p>
        <ul>
            <li><strong>Category:</strong> ${category}</li>
            <li><strong>Date & Time:</strong> ${new Date(dateTime).toLocaleString()}</li>
            <li><strong>Link:</strong> <a href="${link}">${link}</a></li>
        </ul>
        <p><strong>Description:</strong></p>
        <p>${description}</p>
        <hr />
        <p><small>This is an automated notification from Alumni Connect.</small></p>
    `;
    sendNotificationEmail(subject, htmlContent);

    res.status(201).json(newEvent);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to create event" });
  }
};

// Update an event
const updateEvent = async (req, res) => {
  try {
    const [updatedRows] = await Event.update(req.body, {
      where: { id: req.params.id }
    });

    if (updatedRows === 0) return res.status(404).json({ error: "Event not found" });

    const updatedEvent = await Event.findByPk(req.params.id);
    res.json(updatedEvent);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to update event" });
  }
};

// Delete an event
const deleteEvent = async (req, res) => {
  try {
    const deletedRows = await Event.destroy({
      where: { id: req.params.id }
    });

    if (deletedRows === 0) return res.status(404).json({ error: "Event not found" });

    res.json({ message: "Event deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: "Failed to delete event" });
  }
};

module.exports = {
  getEvents,
  getEventById,
  createEvent,
  updateEvent,
  deleteEvent,
};
