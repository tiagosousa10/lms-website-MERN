import {clerkClient} from "@clerk/express";
import Course from "../models/Course.js";
import {v2 as cloudinary} from "cloudinary";

//update role to educator
export const updateRoleToEducator = async (req,res) => {
  try {
    const userId = req.auth.userId;

    await clerkClient.users.updateUserMetadata(userId, {
      publicMetadata: {
        role: "educator",
      }
    })
    res.json({success:true, message: "User role updated to educator, You can now create courses"})


  } catch(error) {
    res.json({success: false, message: error.message})
    console.log("Error in updateRoleToEducator", error.message)
  }
}

//add new course
export const addCourse = async (req,res) => {
  try {
    const {courseData} = req.body;
    const imageFile = req.file;
    const educatorId = req.auth.userId;

    if(!imageFile) {
      return res.json({success: false, message: "Please upload an image"})
    }

    const parsedCourseData = await JSON.parse(courseData);//parse courseData to json object
    parsedCourseData.educator = educatorId;

    const newCourse = await Course.create(parsedCourseData) 
    const imageUpload = await cloudinary.uploader.upload(imageFile.path)
    newCourse.courseThumbnail = imageUpload.secure_url

    await newCourse.save()

    res.json({success: true, message: "Course added successfully"})    

  } catch(error) {
    res.json({success: false, message: error.message})
    console.log("Error in addCourse", error.message)
  }
}

//get educator courses
export const getEducatorCourses = async(req,res) => {
  try {
    const educator = req.auth.userId;
    const courses = await Course.find({educator})

    res.json({success:true, courses})
  } catch(error) {
    res.json({success: false, message: error.message})
    console.log("Error in getEducatorCourses", error.message)
  }
}
