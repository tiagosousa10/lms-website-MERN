// models/Testimonial.js
import mongoose from "mongoose";

const testimonialSchema = new mongoose.Schema(
  {
    user: { type: String, ref: "User", required: true },
    rating: { type: Number, required: true, min: 1, max: 5 },
    text: { type: String, required: true, minlength: 10, maxlength: 1000 },
  },
  { timestamps: true }
);

const Testimonial = mongoose.model("Testimonial", testimonialSchema);
export default Testimonial;
