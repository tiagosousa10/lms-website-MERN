import express from "express";
import {
  getAllCourses,
  getCategories,
  getCourseId,
} from "../controllers/courseController.js";

const courseRouter = express.Router();

courseRouter.get("/all", getAllCourses);
courseRouter.get("/categories", getCategories);
courseRouter.get("/:id", getCourseId);

export default courseRouter;
