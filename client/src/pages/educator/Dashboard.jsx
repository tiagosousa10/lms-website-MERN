import React, { useContext, useEffect, useState } from "react";
import { AppContext } from "../../context/AppContext";
import { assets } from "../../assets/assets";
import Loading from "../../components/student/Loading";
import axios from "axios";
import { toast } from "react-toastify";

const Dashboard = () => {
  const { currency, backendUrl, isEducator, getToken } = useContext(AppContext);
  const [dashboardData, setDashboardData] = useState(null);

  const fetchDashboardData = async () => {
    try {
      const token = await getToken();
      const { data } = await axios.get(`${backendUrl}/api/educator/dashboard`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (data.success) {
        setDashboardData(data.dashboardData);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  useEffect(() => {
    if (isEducator) {
      fetchDashboardData();
    }
  }, [isEducator]);

  if (!dashboardData) return <Loading />;

  return (
    <div className="min-h-screen  p-4 md:p-8 space-y-8">
      {/* Cards de estatísticas */}
      <div className="flex flex-wrap gap-5">
        <div className="card w-56 bg-base-100 shadow-md border border-base-300">
          <div className="card-body flex flex-row items-center gap-4">
            <img
              src={assets.patients_icon}
              alt="ícone alunos"
              className="w-10 h-10"
            />
            <div>
              <h2 className="card-title text-base-content text-2xl">
                {dashboardData.enrolledStudentsData.length}
              </h2>
              <p className="text-sm text-base-content/70">Inscrições Totais</p>
            </div>
          </div>
        </div>

        <div className="card w-56 bg-base-100 shadow-md border border-base-300">
          <div className="card-body flex flex-row items-center gap-4">
            <img
              src={assets.appointments_icon}
              alt="ícone cursos"
              className="w-10 h-10"
            />
            <div>
              <h2 className="card-title text-base-content text-2xl">
                {dashboardData.totalCourses}
              </h2>
              <p className="text-sm text-base-content/70">Cursos Publicados</p>
            </div>
          </div>
        </div>

        <div className="card w-56 bg-base-100 shadow-md border border-base-300">
          <div className="card-body flex flex-row items-center gap-4">
            <img
              src={assets.earning_icon}
              alt="ícone ganhos"
              className="w-10 h-10"
            />
            <div>
              <h2 className="card-title text-base-content text-2xl">
                {currency}
                {Math.floor(dashboardData.totalEarnings)}
              </h2>
              <p className="text-sm text-base-content/70">Ganhos Totais</p>
            </div>
          </div>
        </div>
      </div>

      {/* Tabela de Últimas Inscrições */}
      <div className="bg-base-100 border border-base-300 rounded-xl overflow-hidden w-full max-w-4xl">
        <div className="p-4 border-b border-base-300">
          <h2 className="text-lg font-semibold text-base-content">
            Últimas Inscrições
          </h2>
        </div>

        <div className="overflow-x-auto">
          <table className="table table-zebra w-full">
            <thead className="text-sm text-base-content">
              <tr>
                <th className="hidden sm:table-cell text-center">#</th>
                <th>Nome do Aluno</th>
                <th>Título do Curso</th>
              </tr>
            </thead>
            <tbody className="text-base-content/80">
              {dashboardData.enrolledStudentsData.map((item, index) => (
                <tr key={index}>
                  <td className="hidden sm:table-cell text-center">
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
                  <td className="truncate">{item.courseTitle}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
