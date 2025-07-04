import React, { useContext, useEffect, useState } from "react";
import { AppContext } from "../../context/AppContext";
import axios from "axios";
import { Line } from "rc-progress";
import { toast } from "react-toastify";

const MyEnrollments = () => {
  const {
    userData,
    enrolledCourses,
    fetchUserEnrolledCourses,
    navigate,
    backendUrl,
    getToken,
    calculateCourseDuration,
    calculateNoOfLectures,
  } = useContext(AppContext);

  const [progressArray, setProgressData] = useState([]);

  const getCourseProgress = async () => {
    try {
      const token = await getToken();
      const temp = await Promise.all(
        enrolledCourses.map(async (course) => {
          const { data } = await axios.post(
            `${backendUrl}/api/user/get-course-progress`,
            { courseId: course._id },
            { headers: { Authorization: `Bearer ${token}` } }
          );
          const total = calculateNoOfLectures(course);
          const completed = data.progressData?.lectureCompleted.length || 0;
          return { totalLectures: total, lectureCompleted: completed };
        })
      );
      setProgressData(temp);
    } catch (error) {
      toast.error(error.message);
    }
  };

  useEffect(() => {
    if (userData) fetchUserEnrolledCourses();
  }, [userData]);

  useEffect(() => {
    if (enrolledCourses.length > 0) getCourseProgress();
  }, [enrolledCourses]);

  return (
    <div className=" min-h-screen px-6 md:px-20 pt-10 pb-16 space-y-8">
      <h1 className="text-3xl font-semibold text-base-content">
        Os Meus Cursos
      </h1>

      <div className="overflow-x-auto bg-base-100 rounded-lg shadow">
        <table className="table w-full">
          <thead>
            <tr>
              <th>Curso</th>
              <th className="hidden md:table-cell">Duração</th>
              <th className="hidden md:table-cell">Concluído</th>
              <th>Estado</th>
            </tr>
          </thead>
          <tbody>
            {enrolledCourses.map((course, idx) => {
              const prog = progressArray[idx] || {
                lectureCompleted: 0,
                totalLectures: 1,
              };
              const percent =
                (prog.lectureCompleted / prog.totalLectures) * 100;

              return (
                <tr key={course._id}>
                  <td className="flex items-center space-x-4">
                    <img
                      src={course.courseThumbnail}
                      alt=""
                      className="w-16 h-16 rounded-lg object-cover"
                    />
                    <div className="flex-1 space-y-1">
                      <p className="font-medium">{course.courseTitle}</p>
                      <Line
                        className="progress progress-primary h-2 rounded-full"
                        strokeWidth={4}
                        percent={percent}
                      />
                    </div>
                  </td>
                  <td className="hidden md:table-cell">
                    {calculateCourseDuration(course)}
                  </td>
                  <td className="hidden md:table-cell">
                    {prog.lectureCompleted} / {prog.totalLectures}
                  </td>
                  <td>
                    <button
                      onClick={() => navigate("/player/" + course._id)}
                      className={`btn btn-sm text-white ${
                        percent >= 100 ? "btn-success" : "btn-primary"
                      }`}
                    >
                      {percent >= 100 ? "Concluído" : "Em Progresso"}
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default MyEnrollments;
