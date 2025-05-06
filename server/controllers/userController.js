import User from "../models/User";

//get user data
export const getUserData = async(req,res) => {
  try {
    const userId = req.auth.userId;
    const user = await User.findById(userId)

    if(!user) {
      return res.json({success: false, message: "User not found"})
    }

    res.json({success:true, user})
    

  } catch(error) {
    res.json({success: false, message: error.message})
    console.log("Error in getUserData", error.message)
  }
}


//user enrolled courses with lecture links
export const userEnrolledCourses = async(req,res) => {
  try {

    const userId = req.auth.userId;
    const userData = await User.findById(userId).populate('enrolledCourses') // populate enrolledCourses list with course details

    res.json({success:true, enrolledCourse: userData.enrolledCourses})

  } catch(error) {
    res.json({success: false, message: error.message})
    console.log("Error in userEnrolledCourses", error.message)
  }
}
