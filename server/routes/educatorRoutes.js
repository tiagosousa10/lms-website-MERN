import express from "express";
import {
  addCourse,
  deleteCourse,
  educatorDashboardData,
  getEducatorCourses,
  getEnrolledStudentsData,
  updateRoleToEducator,
  removeStudentFromCourse,
  // 👇 NOVOS handlers (garante que estão exportados do controller)
  uploadLectureVideo,
  addLecture,
  deleteLecture,
} from "../controllers/educatorController.js";
import upload from "../configs/multer.js";
import { protectEducator } from "../middlewares/authMiddleware.js";

const educatorRouter = express.Router();

// add educator role
educatorRouter.get("/update-role", updateRoleToEducator);

// add course
educatorRouter.post(
  "/add-course",
  upload.single("image"),
  protectEducator,
  addCourse
);

// get educator courses
educatorRouter.get("/courses", protectEducator, getEducatorCourses);
educatorRouter.get("/dashboard", protectEducator, educatorDashboardData);
educatorRouter.get(
  "/enrolled-students",
  protectEducator,
  getEnrolledStudentsData
);

// delete course
educatorRouter.delete("/course/:courseId", protectEducator, deleteCourse);
educatorRouter.delete(
  "/course/:courseId/student/:userId",
  protectEducator,
  removeStudentFromCourse
);

// upload video
educatorRouter.post(
  "/cloudinary/video",
  protectEducator, // protege antes de processar o ficheiro
  upload.single("video"), // campo do form deve ser "video"
  uploadLectureVideo
);

// add lecture
educatorRouter.post(
  "/course/:courseId/chapter/:chapterId/lecture",
  protectEducator,
  addLecture
);

// delete lecture
educatorRouter.delete(
  "/course/:courseId/chapter/:chapterId/lecture/:lectureId",
  protectEducator,
  deleteLecture
);

export default educatorRouter;
