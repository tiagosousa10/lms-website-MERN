import Course from "../models/Course.js";

//get all courses

export const getAllCourses = async (req, res) => {
  try {
    const { category } = req.query; // ← vem da query string
    const filter = { isPublished: true };

    if (category) filter.category = category; // match exato (enum ajuda)

    const courses = await Course.find(filter)
      .select(["-courseContent", "-enrolledStudents"])
      .populate({ path: "educator" }) // mantém o teu populate
      .sort({ createdAt: -1 });

    res.json({ success: true, courses });
  } catch (error) {
    console.log("Error in getAllCourses", error.message);
    res.json({ success: false, message: error.message });
  }
};

//get all courses
export const getCourseId = async (req, res) => {
  const { id } = req.params;

  try {
    const courseData = await Course.findById(id).populate({ path: "educator" });

    //remove lectureUrl if isPreviewFree is false
    courseData.courseContent.forEach((chapter) => {
      chapter.chapterContent.forEach((lecture) => {
        if (!lecture.isPreviewFree) {
          lecture.lectureUrl = "";
        }
      });
    });

    res.json({ success: true, courseData });
  } catch (error) {
    res.json({ success: false, message: error.message });
    console.log("Error in getCourseId", error.message);
  }
};

export const getCategories = async (req, res) => {
  try {
    const categories = await Course.distinct("category"); // unique values
    res.json({ success: true, categories });
  } catch (err) {
    console.log("Error in /categories", err.message);
    res.status(500).json({ success: false, message: err.message });
  }
};
