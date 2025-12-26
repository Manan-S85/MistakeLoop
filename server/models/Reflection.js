import mongoose from "mongoose";

const reflectionSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  },
  rawText: {
    type: String,
    required: true
  },
  mistakes: [{
    type: String
  }],
  category: {
    type: String
  },
  severity: {
    type: Number,
    min: 0,
    max: 1
  },
  recommendedActions: {
    type: String
  },
  userContext: {
    status: String,
    skills: String,
    sentiment: String,
    situationUnderstanding: String
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

export default mongoose.model("Reflection", reflectionSchema);
