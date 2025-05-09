import express from 'express';
import { getUserCourseProgress, getUserData, purchaseCourse, updateUserProgress, userEnrolledCourses } from '../controllers/userController.js';

const userRouter = express.Router();

userRouter.get('/data', getUserData)
userRouter.get('/enrolled-courses', userEnrolledCourses)
userRouter.post('/purchase', purchaseCourse)

userRouter.post('update-course-progress', updateUserProgress)
userRouter.get('get-course-progress', getUserCourseProgress)


export default userRouter
