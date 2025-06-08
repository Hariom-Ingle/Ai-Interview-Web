import mongoose from "mongoose";

const responseSchema = new mongoose.Schema({
  question: { type: String, required: true },
  userAnswer: { type: String, required: true },
  correctAnswer: { type: String, required: true },
});

const interviewSchema = new mongoose.Schema(
  {
    role: { type: String, required: true },
    experience: { type: String, required: true },
    jobdesc: { type: String, required: true },
    duration: { type: String, required: true },
    mockresponse: {
      type: [responseSchema],
      required: true,
    }, 
    score: {
      type: Number,
      default: 0, // total score (optional)
    },
    feedback: {
      type: String, // AI or user feedback (optional)
    },
  },
  {
    timestamps: true, // adds createdAt and updatedAt fields
  }
);

export default mongoose.model("Interview", interviewSchema);
