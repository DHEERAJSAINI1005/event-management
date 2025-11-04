import mongoose from "mongoose";
import slugify from "slugify";

const eventSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: String,
  startDate: Date,
  endDate: Date,
  duration: Number,
  slug: { type: String, unique: true },
  registrations: [
    {
      name: String,
      email: String,
      registeredAt: { type: Date, default: Date.now },
    },
  ],
});

eventSchema.pre("save", function (next) {
  if (!this.slug) {
    this.slug =
      slugify(this.title, { lower: true, strict: true }) +
      "-" +
      Math.random().toString(36).substring(2, 7);
  }
  next();
});

export default mongoose.model("Event", eventSchema);
