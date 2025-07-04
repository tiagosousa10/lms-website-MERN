import React, { useContext, useEffect, useState } from "react";
import { AppContext } from "../../context/AppContext";
import axios from "axios";
import { toast } from "react-toastify";
import Loading from "../../components/student/Loading";

const MyCourses = () => {
  const { backendUrl, isEducator, currency, getToken } = useContext(AppContext);
  const [courses, setCourses] = useState(null);

  const fetchEducatorCourses = async () => {
    try {
      const token = await getToken();
      const { data } = await axios.get(`${backendUrl}/api/educator/courses`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (data.success) setCourses(data.courses);
    } catch (error) {
      toast.error(error.message);
    }
  };

  useEffect(() => {
    if (isEducator) fetchEducatorCourses();
  }, [isEducator]);

  if (!courses) return <Loading />;

  return (
    <div className="min-h-screen  p-4 md:p-8">
      <div className="w-full max-w-6xl mx-auto">
        <h2 className="text-xl font-semibold text-base-content mb-6">
          Os Meus Cursos
        </h2>

        <div className="overflow-x-auto bg-base-100 border border-base-300 rounded-xl shadow">
          <table className="table table-zebra w-full">
            <thead className="text-base-content text-sm">
              <tr>
                <th className="px-4 py-3">Curso</th>
                <th className="px-4 py-3">Ganhos</th>
                <th className="px-4 py-3">Alunos</th>
                <th className="px-4 py-3">Publicado em</th>
              </tr>
            </thead>
            <tbody className="text-base-content/70">
              {courses.map((course) => (
                <tr key={course._id}>
                  <td className="px-4 py-3 flex items-center gap-3">
                    <img
                      src={course.courseThumbnail}
                      alt="Imagem do Curso"
                      className="w-12 h-12 object-cover rounded-md"
                    />
                    <span className="truncate">{course.courseTitle}</span>
                  </td>
                  <td className="px-4 py-3">
                    {currency}
                    {Math.floor(
                      course.enrolledStudents.length *
                        (course.coursePrice -
                          (course.discount * course.coursePrice) / 100)
                    )}
                  </td>
                  <td className="px-4 py-3">
                    {course.enrolledStudents.length}
                  </td>
                  <td className="px-4 py-3">
                    {new Date(course.createdAt).toLocaleDateString("pt-PT")}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default MyCourses;
