import express from 'express';
import { addCourse, getEducatorCourses, updateRoleToEducator } from '../controllers/educatorController.js';
import upload from '../configs/multer.js';
import { protectEducator } from '../middlewares/authMiddleware.js';

const educatorRouter = express.Router();

//add educator role
educatorRouter.get('/update-role', updateRoleToEducator)
educatorRouter.post('/add-course', upload.single('image'), protectEducator, addCourse)
educatorRouter.get('/courses', protectEducator, getEducatorCourses)

export default educatorRouter;


/* 
{
  "courseTitle": "Web Development Bootcamp",
  "courseDescription": "Test Course Description",
  "coursePrice": 50,
  "discount": 10,
  "courseContent": [
    {
      "chapterId": "chapter1",
      "chapterOrder": 1,
      "chapterTitle": "HTML & CSS Basics",
      "chapterContent": [
        {
          "lectureId": "lecture1",
          "lectureTitle": "Introduction to HTML",
          "lectureDuration": 600,
          "lectureUrl": "https://youtu.be/-HeadgoqJ7A",
          "isPreviewFree": true,
          "lectureOrder": 1
        }
      ]
    }
  ]
}


*/
