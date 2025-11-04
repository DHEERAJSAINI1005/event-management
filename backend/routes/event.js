import express from "express";
import {
  createEvent,
  listEvents,
  getEventBySlug,
  updateEvent,
  deleteEvent,
  searchEvents,
  registerGuest,
  getEventRegistrations
} from "../controllers/event.js";
import { authMiddleware } from "../middleware/auth.js";

const router = express.Router();

router.get("/", listEvents);
router.post("/", authMiddleware, createEvent);
router.put("/:id", authMiddleware, updateEvent);
router.delete("/:id", authMiddleware, deleteEvent);

router.get("/public/:slug", getEventBySlug);
router.post("/public/:slug/register", registerGuest);
router.get("/:id/registrations", getEventRegistrations);

router.get("/search", searchEvents);

export default router;
