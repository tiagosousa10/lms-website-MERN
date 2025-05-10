import {clerkClient} from "@clerk/express";
import Course from "../models/Course.js";
import {v2 as cloudinary} from "cloudinary";
import { Purchase } from "../models/Purchase.js";
import User from "../models/User.js";

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

// get educator dashboard data (total earning, enrolled students, number of courses)
export const educatorDashboardData = async (req,res) => {
  try {
    const educator = req.auth.userId;
    const courses = await Course.find({educator})

    const totalCourses = courses.length; //total number of courses
    const courseIds = courses.map((course) => course._id) //array of course ids

    //calculate total earnings from purchases
    const purchases = await Purchase.find({
      courseId: {
        $in: courseIds //filter by course ids
      },
      status: "completed"
    })

    const totalEarnings = purchases.reduce((sum, purchase ) => sum + purchase.amount, 0);

    //colect unique enrolled students Ids with their course titles
    const enrolledStudentsData = [];

    for(const course of courses){ //loop through courses
      const students = await User.find({
        _id: {
          $in: course.enrolledStudents
        }, 
      },'name imageUrl') //get name and image url of enrolled students

      students.forEach((student) => {
        enrolledStudentsData.push({
          courseTitle: course.courseTitle,
          student
        })
      })
    }

    res.json({success: true, dashboardData : {
      totalEarnings,
      enrolledStudentsData,
      totalCourses
    }})


  } catch(error) {
    res.json({success: false, message: error.message})
    console.log("Error in educatorDashboardData", error.message)
  }
}

//get enrolled students data with purchase data
export const getEnrolledStudentsData = async(req,res) => {
  try {
    const educator = req.auth.userId;
    const courses = await Course.find({educator})

    const courseIds = courses.map((course) => course._id) //list of course ids

    const purchases = await Purchase.find({
      courseId: {
        $in: courseIds
      },
      status: 'completed'
    }).populate('userId', 'name imageUrl').populate('courseId', 'courseTitle')

    const enrolledStudents = purchases.map((purchase) => ({
      student:purchase.userId,
      courseTitle: purchase.courseId.courseTitle,
      purchaseDate: purchase.createdAt
    }))

    res.json({success:true, enrolledStudents})

  } catch(error) {
    res.json({success: false, message: error.message})
    console.log("Error in getEnrolledStudentsData", error.message)
  }
}
