import Course from "../models/Course.js";

//get all courses
export const getAllCourses = async(req,res) => {
  try {
    const courses = await Course.find({isPublished: true}).select(['-courseContent', '-enrolledStudents']).populate({path: 'educator'})

    res.json({success:true, courses })
    
  } catch(error) {
    res.json({success: false, message: error.message})
    console.log("Error in getAllCourses", error.message)
  }
}
