import express from 'express';
import { addUserRating, getUserCourseProgress, getUserData, purchaseCourse, updateUserProgress, userEnrolledCourses } from '../controllers/userController.js';

const userRouter = express.Router();

userRouter.get('/data', getUserData)
userRouter.post('/purchase', purchaseCourse)
userRouter.get('/enrolled-courses', userEnrolledCourses)
userRouter.post('/update-course-progress', updateUserProgress)
userRouter.post('/get-course-progress', getUserCourseProgress)
userRouter.post('/add-rating', addUserRating)


export default userRouter
