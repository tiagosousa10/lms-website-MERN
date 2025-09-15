import React, { useContext, useEffect, useState } from "react";
import axios from "axios";
import { AppContext } from "../../context/AppContext";
import { toast } from "react-toastify";
import Loading from "../../components/student/Loading";
import { Button } from "../../components/ui/button";

// shadcn/ui
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "../../components/ui/avatar";
import { Card, CardContent } from "../../components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../../components/ui/table";

const StudentsEnrolled = () => {
  const { backendUrl, getToken, isEducator, removeStudentFromCourse } =
    useContext(AppContext);
  const [enrolledStudents, setEnrolledStudents] = useState(null);
  const [loadingRemoval, setLoadingRemoval] = useState({}); // para controlar loading por linha

  const fetchEnrolledStudents = async () => {
    try {
      const token = await getToken();
      const { data } = await axios.get(
        `${backendUrl}/api/educator/enrolled-students`,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (data.success) {
        setEnrolledStudents([...data.enrolledStudents].reverse());
      } else {
        toast.error(data.message);
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

  const handleRemoveStudent = async (courseId, userId) => {
    console.log("🚀 ~ handleRemoveStudent ~ userId:", userId);
    console.log("🚀 ~ handleRemoveStudent ~ courseId:", courseId);
    const confirmed = window.confirm(
      "Tens a certeza que queres remover este aluno do curso?"
    );
    if (!confirmed) return;

    // definir loading para essa combinação (pode usar key courseId + userId)
    const key = `${courseId}-${userId}`;
    setLoadingRemoval((prev) => ({ ...prev, [key]: true }));

    const res = await removeStudentFromCourse(courseId, userId);

    setLoadingRemoval((prev) => {
      const newState = { ...prev };
      delete newState[key];
      return newState;
    });

    if (res?.ok) {
      // atualiza a lista local (remover o item)
      setEnrolledStudents((prev) =>
        prev.filter(
          (item) =>
            !(
              String(item.student?._id) === String(userId) &&
              String(item.courseId?._id) === String(courseId)
            )
        )
      );
      // ou re-buscar toda a lista:
      fetchEnrolledStudents();
    }
  };

  if (!enrolledStudents) return <Loading />;

  return (
    <div className="bg-white min-h-screen p-4 md:p-8">
      <div className="w-full max-w-6xl mx-auto">
        <h2 className="font-medium text-gray-800 text-xl mb-6">
          Alunos Inscritos
        </h2>

        <Card className="w-full bg-white rounded-md border border-solid border-[#ecefca]">
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow className="bg-[#94b4c1] h-[51px] hover:bg-[#94b4c1]">
                  <TableHead className="font-semibold text-white text-sm text-center hidden sm:table-cell w-[60px]">
                    #
                  </TableHead>
                  <TableHead className="font-semibold text-white text-sm">
                    Nome do Aluno
                  </TableHead>
                  <TableHead className="font-semibold text-white text-sm">
                    Título do Curso
                  </TableHead>
                  <TableHead className="font-semibold text-white text-sm hidden sm:table-cell">
                    Data
                  </TableHead>
                  <TableHead className="font-semibold text-white text-sm px-8">
                    Ações
                  </TableHead>
                </TableRow>
              </TableHeader>

              <TableBody>
                {enrolledStudents.map((item, index) => {
                  console.log("🚀 ~ StudentsEnrolled ~ item:", item);
                  const courseId = item.courseId;
                  console.log("🚀 ~ StudentsEnrolled ~ courseId:", courseId);
                  const userId = item.student?._id;
                  const key = `${courseId}-${userId}`;
                  const isLoading = loadingRemoval[key] === true;

                  return (
                    <TableRow
                      key={key}
                      className="border-b border-solid border-gray-200"
                    >
                      <TableCell className="text-[#252525b2] text-sm text-center hidden sm:table-cell">
                        {index + 1}
                      </TableCell>

                      <TableCell>
                        <div className="flex items-center gap-3">
                          <Avatar className="w-[35px] h-[35px]">
                            <AvatarImage
                              src={item.student?.imageUrl}
                              alt={item.student?.name ?? "Aluno"}
                            />
                            <AvatarFallback>
                              {item.student?.name?.[0]?.toUpperCase() ?? "U"}
                            </AvatarFallback>
                          </Avatar>
                          <span className="text-[#252525b2] text-sm truncate">
                            {item.student?.name}
                          </span>
                        </div>
                      </TableCell>

                      <TableCell className="text-[#252525b2] text-sm truncate">
                        {item.courseTitle}
                      </TableCell>

                      <TableCell className="text-[#252525b2] text-sm hidden sm:table-cell">
                        {item.purchaseDate
                          ? new Date(item.purchaseDate).toLocaleDateString(
                              "pt-PT"
                            )
                          : "—"}
                      </TableCell>

                      <TableCell className="text-sm">
                        <Button
                          variant="destructive"
                          className="h-8"
                          disabled={isLoading}
                          onClick={() => handleRemoveStudent(courseId, userId)}
                        >
                          {isLoading ? "Removendo…" : "Remover"}
                        </Button>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default StudentsEnrolled;
