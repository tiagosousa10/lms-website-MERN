import React, { useContext, useEffect, useState } from "react";
import axios from "axios";
import { AppContext } from "../../context/AppContext";
import { toast } from "react-toastify";
import Loading from "../../components/student/Loading";
import { Button } from "../../components/ui/button";

// shadcn/ui
import { Card, CardContent } from "../../components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../../components/ui/table";
const MyCourses = () => {
  const { backendUrl, isEducator, currency, getToken, deleteCourse } =
    useContext(AppContext);
  const [courses, setCourses] = useState(null);
  const [loadingId, setLoadingId] = useState(null);

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

  const handleDeleteCourse = async (courseId, title) => {
    const ok = window.confirm(
      `Tens a certeza que queres remover o curso:\n“${title}”?\nEsta ação é permanente.`
    );
    if (!ok) return;

    setLoadingId(courseId);
    const res = await deleteCourse(courseId);
    setLoadingId(null);

    if (res?.ok) {
      // refrescar a tabela
      fetchEducatorCourses();
    }
  };

  if (!courses) return <Loading />;

  return (
    <main className="bg-white min-h-screen">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h2 className="text-xl font-semibold text-gray-800 mb-6">
          Os Meus Cursos
        </h2>

        <Card className="w-full bg-white border border-[#ecefca]">
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <Table className="min-w-[820px]">
                <TableHeader>
                  <TableRow className="bg-[#94b4c1] h-[51px] hover:bg-[#94b4c1]">
                    <TableHead className="font-semibold text-white text-sm">
                      Curso
                    </TableHead>
                    <TableHead className="font-semibold text-white text-sm">
                      Ganhos
                    </TableHead>
                    <TableHead className="font-semibold text-white text-sm">
                      Alunos
                    </TableHead>
                    <TableHead className="font-semibold text-white text-sm">
                      Publicado em
                    </TableHead>
                    <TableHead className="font-semibold text-white text-sm px-8">
                      Ações
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {courses.map((course) => {
                    const alunos = course.enrolledStudents.length;
                    const precoLiquido =
                      course.coursePrice -
                      (course.discount * course.coursePrice) / 100;
                    const ganhos = Math.floor(alunos * precoLiquido);
                    return (
                      <TableRow
                        key={course._id}
                        className="border-b border-gray-200"
                      >
                        <TableCell className="px-4 py-3 min-w-[240px]">
                          <div className="flex items-center gap-3">
                            <img
                              src={course.courseThumbnail}
                              alt="Imagem do Curso"
                              className="w-12 h-12 object-cover rounded-md shrink-0"
                            />
                            <span className="truncate">
                              {course.courseTitle}
                            </span>
                          </div>
                        </TableCell>
                        <TableCell className="px-4 py-3 whitespace-nowrap">
                          {currency}
                          {ganhos}
                        </TableCell>
                        <TableCell className="px-4 py-3 whitespace-nowrap">
                          {alunos}
                        </TableCell>
                        <TableCell className="px-4 py-3 whitespace-nowrap">
                          {new Date(course.createdAt).toLocaleDateString(
                            "pt-PT"
                          )}
                        </TableCell>
                        <TableCell className="px-4 py-3 whitespace-nowrap">
                          <Button
                            variant="destructive"
                            className="h-9"
                            disabled={loadingId === course._id}
                            onClick={() =>
                              handleDeleteCourse(course._id, course.courseTitle)
                            }
                          >
                            {loadingId === course._id
                              ? "A remover…"
                              : "Remover"}
                          </Button>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      </div>
    </main>
  );
};

export default MyCourses;
