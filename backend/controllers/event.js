import Event from "../models/Event.js";
import { indexEvent, deleteEventFromIndex } from "../utils/elastic.js";
import { esClient } from "../utils/elastic.js";

export const createEvent = async (req, res) => {
  try {
    const data = req.body;
    if (!data.durationHours && data.startDate && data.endDate) {
      const dur = (new Date(data.endDate) - new Date(data.startDate)) / (1000 * 60 * 60);
      data.durationHours = Math.max(0, Math.round(dur * 100) / 100);
    }
    data.createdBy = req.user?.id; 
    const event = await Event.create(data);
    await indexEvent(event);
    res.status(201).json(event);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: err.message || "Server error" });
  }
};

export const listEvents = async (req, res) => {
  try {
    const events = await Event.find().sort({ startDate: -1 });
    res.json(events);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};

export const getEventBySlug = async (req, res) => {
  try {
    const ev = await Event.findOne({ slug: req.params.slug });
    if (!ev) return res.status(404).json({ message: "Event not found" });
    res.json(ev);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};

export const updateEvent = async (req, res) => {
  try {
    const ev = await Event.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!ev) return res.status(404).json({ message: "Event not found" });
    await indexEvent(ev);
    res.json(ev);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};

export const deleteEvent = async (req, res) => {
  try {
    const ev = await Event.findByIdAndDelete(req.params.id);
    if (!ev) return res.status(404).json({ message: "Event not found" });
    await deleteEventFromIndex(req.params.id);
    res.json({ message: "Deleted" });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};

export const searchEvents = async (req, res) => {
  try {
    const { q, date } = req.query;

    const filter = {};

    if (q) {
      filter.title = { $regex: q, $options: "i" };
    }

    if (date) {
      const start = new Date(date);
      const end = new Date(date);
      end.setHours(23, 59, 59, 999);
      filter.startDate = { $lte: end };
      filter.endDate = { $gte: start };
    }

    const events = await Event.find(filter).sort({ startDate: 1 });

    res.json(events);
  } catch (err) {
    console.error("Search error:", err);
    res.status(500).json({ message: "Search error", error: err.message });
  }
};

export const registerGuest = async (req, res) => {
  try {
    const { name, email } = req.body;
    const event = await Event.findOne({ slug: req.params.slug });

    if (!event) return res.status(404).json({ message: "Event not found" });

    event.registrations.push({ name, email });
    await event.save();

    res.json({ message: "Registration successful!" });
  } catch (err) {
    res.status(500).json({ message: "Registration failed" });
  }
};