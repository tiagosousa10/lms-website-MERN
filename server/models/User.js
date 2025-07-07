import express from "express";
import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    _id: { type: String, required: true },
    // clerkId: {
    //   type: String,
    //   required: true,
    //   unique: true,
    // },
    name: { type: String, required: true },
    email: { type: String, required: true },
    imageUrl: { type: String, required: true },
    enrolledCourses: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Course",
      },
    ],
    friends: [
      {
        type: String, // mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],
  },
  {
    // Add this line to enable timestamps -> createdAt and updatedAt
    timestamps: true,
  }
);

const User = mongoose.model("User", userSchema);
export default User;
