import mongoose from "mongoose";

const launchSchema = new mongoose.Schema({
  id: { type: Number, required: true },
  mission: { type: String, required: true },
  rocket: { type: String, required: true },
  launchDate: { type: Date, required: true },
  destination: { type: String },
  customers: [String],
  success: { type: Boolean, required: true, default: true },
});

export default mongoose.model("Launch", launchSchema);
