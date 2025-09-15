import express from "express";
import {
  addCourse,
  deleteCourse,
  educatorDashboardData,
  getEducatorCourses,
  getEnrolledStudentsData,
  updateRoleToEducator,
  removeStudentFromCourse,
} from "../controllers/educatorController.js";
import upload from "../configs/multer.js";
import { protectEducator } from "../middlewares/authMiddleware.js";

const educatorRouter = express.Router();

//add educator role
educatorRouter.get("/update-role", updateRoleToEducator);
educatorRouter.post(
  "/add-course",
  upload.single("image"),
  protectEducator,
  addCourse
);
educatorRouter.get("/courses", protectEducator, getEducatorCourses);
educatorRouter.get("/dashboard", protectEducator, educatorDashboardData);
educatorRouter.get(
  "/enrolled-students",
  protectEducator,
  getEnrolledStudentsData
);
educatorRouter.delete("/course/:courseId", protectEducator, deleteCourse);
educatorRouter.delete(
  "/course/:courseId/student/:userId",
  protectEducator,
  removeStudentFromCourse
);

export default educatorRouter;
