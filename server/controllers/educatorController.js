import { clerkClient } from "@clerk/express";
import Course from "../models/Course.js";
import { v2 as cloudinary } from "cloudinary";
import { Purchase } from "../models/Purchase.js";
import User from "../models/User.js";
import { CourseProgress } from "../models/CourseProgress.js";
import fs from "fs/promises"; // <-- NOVO: para remover ficheiros temporários do multer

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

    // limpa tmp se for o caso
    try {
      await fs.unlink(imageFile.path);
    } catch {}

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
      courseId: purchase.courseId._id,
    }));

    res.json({ success: true, enrolledStudents });
  } catch (error) {
    res.json({ success: false, message: error.message });
    console.log("Error in getEnrolledStudentsData", error.message);
  }
};

// DELETE a course
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
      const publicId =
        course.courseThumbnailId ||
        (course.courseThumbnail
          ? course.courseThumbnail.split("/").slice(-1)[0].split(".")[0]
          : null);

      if (publicId) {
        await cloudinary.uploader.destroy(publicId);
      }
    } catch (_) {}

    // 3b) NOVO: remover vídeos de aulas (Cloudinary) antes de apagar o curso
    try {
      for (const ch of course.courseContent || []) {
        for (const lec of ch.chapterContent || []) {
          if (
            lec?.lectureProvider === "cloudinary" &&
            lec?.cloudinaryPublicId
          ) {
            await cloudinary.uploader.destroy(lec.cloudinaryPublicId, {
              resource_type: "video", // IMPORTANTÍSSIMO p/ vídeos
            });
          }
        }
      }
    } catch (e) {
      console.warn("Falha ao apagar vídeos do curso:", e?.message);
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

//delete a student from a course
export const removeStudentFromCourse = async (req, res) => {
  try {
    const educatorId = req.auth.userId;
    const { courseId, userId } = req.params;

    // 1) Confirmar que o curso existe e pertence a este educator
    const course = await Course.findById(courseId);
    if (!course)
      return res
        .status(404)
        .json({ success: false, message: "Curso não encontrado" });

    if (String(course.educator) !== String(educatorId)) {
      return res.status(403).json({
        success: false,
        message: "Sem permissão para alterar este curso",
      });
    }

    // 2) Verificar se o aluno está inscrito
    const isEnrolled = course.enrolledStudents?.some(
      (sid) => String(sid) === String(userId)
    );
    if (!isEnrolled) {
      return res.status(400).json({
        success: false,
        message: "Este aluno não está inscrito neste curso",
      });
    }

    // 3) Remover aluno do array enrolledStudents do curso
    await Course.updateOne(
      { _id: courseId },
      { $pull: { enrolledStudents: String(userId) } }
    );

    // 4) Remover curso da lista "enrolledCourses" do aluno
    await User.updateOne(
      { _id: String(userId) },
      { $pull: { enrolledCourses: course._id } }
    );

    // 5) Remover progresso desse aluno nesse curso
    await CourseProgress.deleteMany({
      userId: String(userId),
      courseId: String(course._id),
    });

    await Purchase.deleteMany({ userId: String(userId), courseId: course._id });

    res.json({ success: true, message: "Aluno removido do curso com sucesso" });
  } catch (error) {
    console.log("Error in removeStudentFromCourse:", error.message);
    res.status(500).json({ success: false, message: error.message });
  }
};

/**
 * Upload do vídeo (multer -> Cloudinary).
 * Espera form-data com campo "video" e, opcionalmente, "courseId".
 * Devolve: secure_url, public_id, duration (s).
 */
export const uploadLectureVideo = async (req, res) => {
  try {
    const file = req.file; // field "video"
    const { courseId } = req.body || {};

    if (!file) {
      return res
        .status(400)
        .json({ success: false, message: "Falta ficheiro de vídeo" });
    }

    // Para < 100 MB usa upload normal (resposta completa do Cloudinary)
    const result = await cloudinary.uploader.upload(file.path, {
      resource_type: "video",
      folder: `courses/${courseId || "general"}/lectures`,
      // opcional: eager transformations, overwrite, etc.
    });

    // limpa tmp
    try {
      await fs.unlink(file.path);
    } catch {}

    // devolve TUDO o que o front precisa
    return res.json({
      success: true,
      data: {
        public_id: result.public_id,
        secure_url: result.secure_url,
        duration: Math.round(result.duration || 0),
        width: result.width,
        height: result.height,
        format: result.format,
        resource_type: result.resource_type,
      },
    });
  } catch (err) {
    console.error("[uploadLectureVideo] error:", err);
    return res.status(500).json({ success: false, message: err.message });
  }
};

/**
 * Cria uma aula (YouTube OU Cloudinary) num capítulo de um curso.
 * Body:
 *  - lectureId, lectureTitle, lectureOrder, isPreviewFree
 *  - provider: "youtube" | "cloudinary"
 *  - youtubeUrl (se provider="youtube")
 *  - cloudinaryUrl, cloudinaryPublicId, duration (se provider="cloudinary")
 */
export const addLecture = async (req, res) => {
  try {
    const educatorId = req.auth.userId;
    const { courseId, chapterId } = req.params;

    const {
      lectureId,
      lectureTitle,
      lectureOrder,
      isPreviewFree,
      provider, // "youtube" | "cloudinary"
      youtubeUrl,
      cloudinaryUrl,
      cloudinaryPublicId,
      duration, // segundos (Cloudinary devolve)
    } = req.body;

    const course = await Course.findById(courseId);
    if (!course)
      return res
        .status(404)
        .json({ success: false, message: "Curso não encontrado" });
    if (String(course.educator) !== String(educatorId))
      return res.status(403).json({ success: false, message: "Sem permissão" });

    const chapter = course.courseContent.find((c) => c.chapterId === chapterId);
    if (!chapter)
      return res
        .status(404)
        .json({ success: false, message: "Capítulo não encontrado" });

    const isCloud = provider === "cloudinary";
    const lectureUrl = isCloud ? cloudinaryUrl : youtubeUrl;
    if (!lectureUrl) {
      return res
        .status(400)
        .json({ success: false, message: "URL do vídeo em falta" });
    }

    const lecture = {
      lectureId,
      lectureTitle,
      lectureOrder: Number(lectureOrder),
      isPreviewFree: !!isPreviewFree,
      lectureProvider: isCloud ? "cloudinary" : "youtube",
      lectureUrl,
      lectureDuration: Number(duration) || 0,
      cloudinaryPublicId: isCloud ? cloudinaryPublicId : undefined,
    };

    chapter.chapterContent.push(lecture);
    await course.save();

    return res.json({ success: true, message: "Aula adicionada", lecture });
  } catch (error) {
    console.error("addLecture error:", error);
    return res.status(500).json({ success: false, message: error.message });
  }
};

/**
 * Remove uma aula. Se for Cloudinary, apaga também o vídeo remoto.
 */
export const deleteLecture = async (req, res) => {
  try {
    const educatorId = req.auth.userId;
    const { courseId, chapterId, lectureId } = req.params;

    const course = await Course.findById(courseId);
    if (!course)
      return res
        .status(404)
        .json({ success: false, message: "Curso não encontrado" });
    if (String(course.educator) !== String(educatorId))
      return res.status(403).json({ success: false, message: "Sem permissão" });

    const chapter = course.courseContent.find((c) => c.chapterId === chapterId);
    if (!chapter)
      return res
        .status(404)
        .json({ success: false, message: "Capítulo não encontrado" });

    const idx = chapter.chapterContent.findIndex(
      (l) => l.lectureId === lectureId
    );
    if (idx < 0)
      return res
        .status(404)
        .json({ success: false, message: "Aula não encontrada" });

    const lec = chapter.chapterContent[idx];

    if (lec.lectureProvider === "cloudinary" && lec.cloudinaryPublicId) {
      try {
        await cloudinary.uploader.destroy(lec.cloudinaryPublicId, {
          resource_type: "video", // obrigatório p/ vídeo
        });
      } catch (e) {
        console.warn("Falha a apagar vídeo Cloudinary:", e?.message);
      }
    }

    chapter.chapterContent.splice(idx, 1);
    await course.save();

    return res.json({ success: true, message: "Aula removida" });
  } catch (error) {
    console.error("deleteLecture error:", error);
    return res.status(500).json({ success: false, message: error.message });
  }
};
