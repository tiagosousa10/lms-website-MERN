import React, { useContext, useEffect, useState } from "react";
import { AppContext } from "../../context/AppContext";
import { assets } from "../../assets/assets";
import Loading from "../../components/student/Loading";
import axios from "axios";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

// shadcn/ui
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "../../components/ui/avatar";
import { Button } from "../../components/ui/button";
import { Card, CardContent } from "../../components/ui/card";
import { Input } from "../../components/ui/input";
import { Separator } from "../../components/ui/separator";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../../components/ui/table";

const Dashboard = () => {
  const navigate = useNavigate();
  const { currency, backendUrl, isEducator, getToken } = useContext(AppContext);
  const [dashboardData, setDashboardData] = useState(null);

  const fetchDashboardData = async () => {
    try {
      const token = await getToken();
      const { data } = await axios.get(`${backendUrl}/api/educator/dashboard`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (data.success) setDashboardData(data.dashboardData);
      else toast.error(data.message);
    } catch (error) {
      toast.error(error.message);
    }
  };

  useEffect(() => {
    if (isEducator) fetchDashboardData();
  }, [isEducator]);

  if (!dashboardData) return <Loading />;

  return (
    <main className="bg-white min-h-screen">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Cards em grid responsivo */}
        <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-10">
          <Card className="bg-[#547792] border border-black/10">
            <CardContent className="flex items-center p-5">
              <img
                className="w-14 h-14 mr-4"
                alt="ícone alunos"
                src={assets.patients_icon}
              />
              <div>
                <div className="font-semibold text-[#ecefca] text-2xl">
                  {dashboardData.enrolledStudentsData.length}
                </div>
                <div className="text-[#ecefca]">Inscrições Totais</div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-[#94b4c1] border border-black/10">
            <CardContent className="flex items-center p-5">
              <img
                className="w-14 h-14 mr-4"
                alt="ícone cursos"
                src={assets.appointments_icon}
              />
              <div>
                <div className="font-semibold text-[#213448] text-2xl">
                  {dashboardData.totalCourses}
                </div>
                <div className="text-[#213448]">Cursos Publicados</div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-[#ecefca] border border-black/10">
            <CardContent className="flex items-center p-5">
              <img
                className="w-14 h-14 mr-4"
                alt="ícone ganhos"
                src={assets.earning_icon}
              />
              <div>
                <div className="font-semibold text-[#505050] text-2xl">
                  {currency}
                  {Math.floor(dashboardData.totalEarnings)}
                </div>
                <div className="text-[#505050]">Ganhos Totais</div>
              </div>
            </CardContent>
          </Card>
        </section>

        {/* Tabela enrolments com overflow-x em mobile */}
        <section className="mt-8">
          <h2 className="font-medium text-gray-800 text-lg mb-4">
            Últimas Inscrições
          </h2>
          <Card className="w-full bg-white border border-[#ecefca]">
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <Table className="min-w-[720px]">
                  <TableHeader>
                    <TableRow className="bg-[#94b4c1] h-[51px] hover:bg-[#94b4c1]">
                      <TableHead className="font-semibold text-white text-sm pl-5">
                        #
                      </TableHead>
                      <TableHead className="font-semibold text-white text-sm">
                        Nome do Aluno
                      </TableHead>
                      <TableHead className="font-semibold text-white text-sm">
                        Título do Curso
                      </TableHead>
                      <TableHead className="font-semibold text-white text-sm"></TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {dashboardData.enrolledStudentsData.map((item, index) => (
                      <TableRow
                        key={index}
                        className="border-b border-gray-200"
                      >
                        <TableCell className="text-[#252525b2] text-sm pl-5">
                          {index + 1}
                        </TableCell>
                        <TableCell className="pr-2">
                          <div className="flex items-center gap-3">
                            <img
                              src={item.student.imageUrl}
                              alt={item.student.name}
                              className="w-9 h-9 rounded-full object-cover"
                            />
                            <span className="text-[#252525b2] text-sm">
                              {item.student.name}
                            </span>
                          </div>
                        </TableCell>
                        <TableCell className="text-[#252525b2] text-sm">
                          {item.courseTitle}
                        </TableCell>
                        <TableCell className="text-[#252525b2] text-sm"></TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </section>
      </div>
    </main>
  );
};

export default Dashboard;
