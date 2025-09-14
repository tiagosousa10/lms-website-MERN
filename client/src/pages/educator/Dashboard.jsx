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
    <div className="bg-white min-h-screen">
      <div className="flex">
        {/* Main Content */}
        <main className="flex-1 p-8">
          {/* Stats Cards (conteúdo dinâmico, apenas estilo trocado) */}
          <div className="flex flex-wrap gap-6 mb-8">
            {/* Inscrições Totais */}
            <Card className="w-[230px] h-[99px] bg-[#547792] rounded-md border border-solid border-[#0000001a] shadow-[0px_0px_4px_#0000001a]">
              <CardContent className="flex items-center p-4 h-full">
                <img
                  className="w-[57px] h-[57px] mr-4"
                  alt="ícone alunos"
                  src={assets.patients_icon}
                />
                <div className="flex flex-col">
                  <div className="font-medium text-[#ecefca] text-2xl">
                    {dashboardData.enrolledStudentsData.length}
                  </div>
                  <div className="font-medium text-[#ecefca] text-base">
                    Inscrições Totais
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Cursos Publicados */}
            <Card className="w-[230px] h-[99px] bg-[#94b4c1] rounded-md border border-solid border-[#0000001a] shadow-[0px_0px_4px_#0000001a]">
              <CardContent className="flex items-center p-4 h-full">
                <img
                  className="w-[57px] h-[57px] mr-4"
                  alt="ícone cursos"
                  src={assets.appointments_icon}
                />
                <div className="flex flex-col">
                  <div className="font-medium text-[#213448] text-2xl">
                    {dashboardData.totalCourses}
                  </div>
                  <div className="font-medium text-[#213448] text-base">
                    Cursos Publicados
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Ganhos Totais */}
            <Card className="w-[230px] h-[99px] bg-[#ecefca] rounded-md border border-solid border-[#0000001a] shadow-[0px_0px_4px_#0000001a]">
              <CardContent className="flex items-center p-4 h-full">
                <img
                  className="w-[57px] h-[57px] mr-4"
                  alt="ícone ganhos"
                  src={assets.earning_icon}
                />
                <div className="flex flex-col">
                  <div className="font-medium text-[#505050] text-2xl">
                    {currency}
                    {Math.floor(dashboardData.totalEarnings)}
                  </div>
                  <div className="font-medium text-[#505050] text-base">
                    Ganhos Totais
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Últimas Inscrições (tabela shadcn/ui, mesma lógica) */}
          <div className="mt-8">
            <h2 className="font-medium text-gray-800 text-lg mb-4">
              Ultimas Inscrições
            </h2>

            <Card className="w-full max-w-[908px] bg-white rounded-md border border-solid border-[#ecefca]">
              <CardContent className="p-0">
                <Table>
                  <TableHeader>
                    <TableRow className="bg-[#94b4c1] h-[51px] hover:bg-[#94b4c1]">
                      <TableHead className="font-semibold text-white text-sm pl-5">
                        #
                      </TableHead>
                      <TableHead className="font-semibold text-white text-sm">
                        Nome do Aluno
                      </TableHead>
                      <TableHead className="font-semibold text-white text-sm">
                        Titulo do Curso
                      </TableHead>
                      <TableHead className="font-semibold text-white text-sm">
                        {/* Data opcional — não existe no payload original desta página */}
                      </TableHead>
                    </TableRow>
                  </TableHeader>

                  <TableBody>
                    {dashboardData.enrolledStudentsData.map((item, index) => (
                      <TableRow
                        key={index}
                        className="border-b border-solid border-gray-200"
                      >
                        <TableCell className="text-[#252525b2] text-sm pl-5">
                          {index + 1}
                        </TableCell>

                        <TableCell className="pr-2">
                          <div className="flex items-center gap-3">
                            <Avatar className="w-[35px] h-[35px]">
                              <AvatarImage
                                src={item.student.imageUrl}
                                alt={item.student.name}
                              />
                              <AvatarFallback>
                                {item.student?.name?.[0] ?? "U"}
                              </AvatarFallback>
                            </Avatar>
                            <span className="text-[#252525b2] text-sm">
                              {item.student.name}
                            </span>
                          </div>
                        </TableCell>

                        <TableCell className="text-[#252525b2] text-sm">
                          {item.courseTitle}
                        </TableCell>

                        <TableCell className="text-[#252525b2] text-sm">
                          {/* Se tiveres data no payload, coloca-a aqui */}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </div>
        </main>
      </div>
    </div>
  );
};

export default Dashboard;
