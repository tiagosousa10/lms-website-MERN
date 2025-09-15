import { clerkClient } from "@clerk/express";
import Course from "../models/Course.js";
import { v2 as cloudinary } from "cloudinary";
import { Purchase } from "../models/Purchase.js";
import User from "../models/User.js";
import { CourseProgress } from "../models/CourseProgress.js";

//update role to educator
export const updateRoleToEducator = async (req, res) => {
  try {
    const userId = req.auth.userId;

    await clerkClient.users.updateUserMetadata(userId, {
      publicMetadata: {
        role: "educator",
      },
    });
    res.json({
      success: true,
      message: "User role updated to educator, You can now create courses",
    });
  } catch (error) {
    res.json({ success: false, message: error.message });
    console.log("Error in updateRoleToEducator", error.message);
  }
};

// addCourse: guarda também o public_id
export const addCourse = async (req, res) => {
  try {
    const { courseData } = req.body;
    const imageFile = req.file;
    const educatorId = req.auth.userId;

    if (!imageFile) {
      return res.json({ success: false, message: "Please upload an image" });
    }

    const parsedCourseData = await JSON.parse(courseData);
    parsedCourseData.educator = educatorId;

    const newCourse = await Course.create(parsedCourseData);

    // Sugestão: usar uma pasta para organização
    const upload = await cloudinary.uploader.upload(imageFile.path, {
      folder: "courses",
    });

    newCourse.courseThumbnail = upload.secure_url;
    newCourse.courseThumbnailId = upload.public_id; // <— guarda o public_id
    await newCourse.save();

    res.json({ success: true, message: "Course added successfully" });
  } catch (error) {
    res.json({ success: false, message: error.message });
    console.log("Error in addCourse", error.message);
  }
};

//get educator courses
export const getEducatorCourses = async (req, res) => {
  try {
    const educator = req.auth.userId;
    const courses = await Course.find({ educator });

    res.json({ success: true, courses });
  } catch (error) {
    res.json({ success: false, message: error.message });
    console.log("Error in getEducatorCourses", error.message);
  }
};

// get educator dashboard data (total earning, enrolled students, number of courses)
export const educatorDashboardData = async (req, res) => {
  try {
    const educator = req.auth.userId;
    const courses = await Course.find({ educator });

    const totalCourses = courses.length; //total number of courses
    const courseIds = courses.map((course) => course._id); //array of course ids

    //calculate total earnings from purchases
    const purchases = await Purchase.find({
      courseId: {
        $in: courseIds, //filter by course ids
      },
      status: "completed",
    });

    const totalEarnings = purchases.reduce(
      (sum, purchase) => sum + purchase.amount,
      0
    );

    //colect unique enrolled students Ids with their course titles
    const enrolledStudentsData = [];

    for (const course of courses) {
      //loop through courses
      const students = await User.find(
        {
          _id: {
            $in: course.enrolledStudents,
          },
        },
        "name imageUrl"
      ); //get name and image url of enrolled students

      students.forEach((student) => {
        enrolledStudentsData.push({
          courseTitle: course.courseTitle,
          student,
        });
      });
    }

    res.json({
      success: true,
      dashboardData: {
        totalEarnings,
        enrolledStudentsData,
        totalCourses,
      },
    });
  } catch (error) {
    res.json({ success: false, message: error.message });
    console.log("Error in educatorDashboardData", error.message);
  }
};

//get enrolled students data with purchase data
export const getEnrolledStudentsData = async (req, res) => {
  try {
    const educator = req.auth.userId;
    const courses = await Course.find({ educator });

    const courseIds = courses.map((course) => course._id); //list of course ids

    const purchases = await Purchase.find({
      courseId: {
        $in: courseIds,
      },
      status: "completed",
    })
      .populate("userId", "name imageUrl")
      .populate("courseId", "courseTitle");

    const enrolledStudents = purchases.map((purchase) => ({
      student: purchase.userId,
      courseTitle: purchase.courseId.courseTitle,
      purchaseDate: purchase.createdAt,
    }));

    res.json({ success: true, enrolledStudents });
  } catch (error) {
    res.json({ success: false, message: error.message });
    console.log("Error in getEnrolledStudentsData", error.message);
  }
};

// DELETE /api/educator/course/:courseId
export const deleteCourse = async (req, res) => {
  try {
    const educatorId = req.auth.userId;
    const { courseId } = req.params;

    // 1) Encontrar curso
    const course = await Course.findById(courseId);
    if (!course) {
      return res
        .status(404)
        .json({ success: false, message: "Curso não encontrado" });
    }

    // 2) Garantir que o curso pertence ao educator autenticado
    if (String(course.educator) !== String(educatorId)) {
      return res.status(403).json({
        success: false,
        message: "Sem permissão para remover este curso",
      });
    }

    // 3) Remover thumbnail do Cloudinary (se possível)
    try {
      // Ideal: guardar o public_id quando fazes upload (ver atualização do addCourse abaixo)
      const publicId =
        course.courseThumbnailId ||
        (course.courseThumbnail
          ? course.courseThumbnail.split("/").slice(-1)[0].split(".")[0]
          : null);

      if (publicId) {
        await cloudinary.uploader.destroy(publicId); // apaga um asset por public_id
      }
      // Dica: se guardares folder (ex: "courses/abc123"), mantém isso em courseThumbnailId.
    } catch (_) {
      // Não falhar o delete do curso só porque a imagem não foi apagada
    }

    // 4) Remover o curso da lista de inscritos dos alunos
    if (course.enrolledStudents?.length) {
      await User.updateMany(
        { _id: { $in: course.enrolledStudents } },
        { $pull: { enrolledCourses: course._id } }
      );
    }

    // 5) Apagar progressos associados ao curso
    await CourseProgress.deleteMany({ courseId: String(course._id) });

    // 6) (Opcional) Apagar compras associadas ao curso
    await Purchase.deleteMany({ courseId: course._id });

    // 7) Apagar o curso
    await Course.findByIdAndDelete(course._id);

    res.json({ success: true, message: "Curso removido com sucesso" });
  } catch (error) {
    console.log("Error in deleteCourse:", error.message);
    res.status(500).json({ success: false, message: error.message });
  }
};
