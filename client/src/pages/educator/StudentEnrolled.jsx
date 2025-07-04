import React, { useContext, useEffect, useState } from "react";
import axios from "axios";
import { AppContext } from "../../context/AppContext";
import { toast } from "react-toastify";
import Loading from "../../components/student/Loading";

const StudentsEnrolled = () => {
  const { backendUrl, getToken, isEducator } = useContext(AppContext);
  const [enrolledStudents, setEnrolledStudents] = useState(null);

  const fetchEnrolledStudents = async () => {
    try {
      const token = await getToken();
      const { data } = await axios.get(
        `${backendUrl}/api/educator/enrolled-students`,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (data.success) {
        setEnrolledStudents(data.enrolledStudents.reverse());
      } else {
        toast.success(data.message);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  useEffect(() => {
    if (isEducator) {
      fetchEnrolledStudents();
    }
  }, [isEducator]);

  if (!enrolledStudents) return <Loading />;

  return (
    <div className="min-h-screen bg-base-200 p-4 md:p-8">
      <div className="w-full max-w-6xl mx-auto">
        <h2 className="text-xl font-semibold text-base-content mb-6">
          Alunos Inscritos
        </h2>

        <div className="overflow-x-auto bg-base-100 border border-base-300 rounded-xl shadow">
          <table className="table table-zebra w-full">
            <thead className="text-sm text-base-content">
              <tr>
                <th className="text-center hidden sm:table-cell">#</th>
                <th>Nome do Aluno</th>
                <th>Título do Curso</th>
                <th className="hidden sm:table-cell">Data</th>
              </tr>
            </thead>
            <tbody className="text-base-content/70">
              {enrolledStudents.map((item, index) => (
                <tr key={index}>
                  <td className="text-center hidden sm:table-cell">
                    {index + 1}
                  </td>
                  <td className="flex items-center gap-3 py-3 px-2 md:px-4">
                    <div className="avatar">
                      <div className="w-9 rounded-full">
                        <img src={item.student.imageUrl} alt="Foto do aluno" />
                      </div>
                    </div>
                    <span className="truncate">{item.student.name}</span>
                  </td>
                  <td className="px-4 py-3 truncate">{item.courseTitle}</td>
                  <td className="px-4 py-3 hidden sm:table-cell">
                    {new Date(item.purchaseDate).toLocaleDateString("pt-PT")}
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

export default StudentsEnrolled;
