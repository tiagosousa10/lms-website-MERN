// src/pages/student/MyEnrollments.jsx
import React, { useContext, useEffect, useState } from "react";
import { AppContext } from "../../context/AppContext";
import axios from "axios";
import { Line } from "rc-progress";
import { toast } from "react-toastify";

import { jsPDF } from "jspdf";
import * as htmlToImage from "html-to-image";

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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [enrolledCourses]);

  // === NOVO: gerar PDF a partir de um template escondido por curso ===
  const handleDownloadCertificate = async (course) => {
    try {
      const el = document.getElementById(`cert-${course._id}`);
      if (!el) {
        toast.error("Template do certificado não encontrado.");
        return;
      }

      const dataUrl = await htmlToImage.toPng(el, {
        pixelRatio: 2,
        cacheBust: true,
        backgroundColor: "#ffffff",
        skipFonts: true, // <- evita o erro "font is undefined"
        style: {
          all: "initial",
          display: "block",
          fontFamily:
            "Inter, ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto, Arial",
          color: "#111827",
          background: "#ffffff",
          width: "1123px",
          height: "794px",
        },
      });

      const pdf = new jsPDF("landscape", "mm", "a4");
      const pageWidth = pdf.internal.pageSize.getWidth();
      const pageHeight = pdf.internal.pageSize.getHeight();

      const img = new Image();
      img.src = dataUrl;
      await new Promise((res, rej) => {
        img.onload = res;
        img.onerror = rej;
      });

      const imgWidth = pageWidth;
      const imgHeight = (img.naturalHeight * imgWidth) / img.naturalWidth;
      const y = (pageHeight - imgHeight) / 2;

      pdf.addImage(dataUrl, "PNG", 0, y, imgWidth, imgHeight);

      const studentName = (userData?.name || "Aluno").replace(/\s+/g, "_");
      pdf.save(`certificado-${studentName}-${course.courseTitle}.pdf`);
    } catch (err) {
      console.error(err);
      toast.error("Falha ao gerar o certificado.");
    }
  };

  return (
    <div className="min-h-screen px-6 md:px-20 pt-10 pb-16 space-y-8">
      <h1 className="text-3xl font-semibold text-[#37353E]">Os Meus Cursos</h1>

      <div className="overflow-x-auto bg-[#213448] rounded-lg shadow text-[#D3DAD9]">
        <table className="table w-full">
          <thead>
            <tr className="text-[#D3DAD9]">
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
                (prog.lectureCompleted / Math.max(prog.totalLectures, 1)) * 100;

              const completed = percent >= 100;

              return (
                <tr key={course._id} className="align-top">
                  <td className="flex items-center gap-4">
                    <img
                      src={course.courseThumbnail}
                      alt=""
                      className="w-16 h-16 rounded-lg object-cover"
                    />
                    <div className="flex-1 space-y-2">
                      <p className="font-medium">{course.courseTitle}</p>
                      <Line
                        className="progress progress-primary h-2 rounded-full"
                        strokeWidth={4}
                        percent={percent}
                      />
                    </div>

                    {/* === NOVO: Template oculto do certificado (um por curso) === */}
                    <div
                      id={`cert-${course._id}`}
                      style={{
                        position: "absolute",
                        left: "-99999px",
                        top: 0,
                        width: "1123px", // A4 landscape @ ~96dpi
                        height: "794px",
                        padding: "48px",
                        background: "white",
                        border: "6px solid #1f2937", // cinza-900
                        boxShadow: "0 10px 30px rgba(0,0,0,0.1)",
                        fontFamily:
                          "Inter, ui-sans-serif, system-ui, -apple-system",
                      }}
                    >
                      <div
                        style={{
                          position: "absolute",
                          inset: "16px",
                          border: "2px solid #9ca3af", // cinza-400
                        }}
                      />
                      <header
                        style={{
                          textAlign: "center",
                          marginTop: 12,
                          paddingTop: 48,
                        }}
                      >
                        <div
                          style={{
                            fontSize: 14,
                            letterSpacing: 2,
                            color: "#6b7280",
                            marginTop: 12,
                          }}
                        >
                          CERTIFICADO DE CONCLUSÃO
                        </div>
                        <h1
                          style={{
                            fontSize: 36,
                            margin: "8px 0 0 0",
                            color: "#111827",
                            fontWeight: 700,
                          }}
                        >
                          Declaração de Conclusão
                        </h1>
                      </header>

                      <main
                        style={{
                          textAlign: "center",
                          marginTop: 48,
                          color: "#111827",
                        }}
                      >
                        <p style={{ fontSize: 16, color: "#374151" }}>
                          Certifica-se que
                        </p>
                        <div
                          style={{
                            fontSize: 32,
                            fontWeight: 700,
                            marginTop: 8,
                          }}
                        >
                          {userData?.name || "Nome do Aluno"}
                        </div>
                        <p
                          style={{
                            fontSize: 16,
                            color: "#374151",
                            marginTop: 16,
                          }}
                        >
                          concluiu com aproveitamento o curso
                        </p>
                        <div
                          style={{
                            fontSize: 24,
                            fontWeight: 600,
                            marginTop: 4,
                          }}
                        >
                          {course.courseTitle}
                        </div>
                        <p
                          style={{
                            fontSize: 16,
                            color: "#374151",
                            marginTop: 16,
                          }}
                        >
                          com duração de{" "}
                          <strong>
                            {calculateCourseDuration(course) || "—"}
                          </strong>
                          , emitido em{" "}
                          <strong>
                            {new Date().toLocaleDateString("pt-PT")}
                          </strong>
                          .
                        </p>
                      </main>

                      <footer
                        style={{
                          position: "absolute",
                          bottom: 48,
                          left: 48,
                          right: 48,
                          display: "flex",
                          justifyContent: "space-between",
                          alignItems: "center",
                          color: "#374151",
                        }}
                      >
                        <div style={{ textAlign: "left" }}>
                          <div
                            style={{
                              width: 220,
                              height: 1,
                              background: "#9ca3af",
                              marginBottom: 8,
                            }}
                          />
                          <div style={{ fontSize: 14, fontWeight: 600 }}>
                            Coordenação do Curso
                          </div>
                          <div style={{ fontSize: 12, color: "#6b7280" }}>
                            Assinatura digitalizada
                          </div>
                        </div>
                        <div style={{ textAlign: "right" }}>
                          <div style={{ fontSize: 12, color: "#6b7280" }}>
                            © {new Date().getFullYear()} tsAcademy
                          </div>
                        </div>
                      </footer>
                    </div>
                  </td>

                  <td className="hidden md:table-cell">
                    {calculateCourseDuration(course)}
                  </td>

                  <td className="hidden md:table-cell">
                    {prog.lectureCompleted} / {prog.totalLectures}
                  </td>

                  <td>
                    <div className="flex flex-col md:flex-row gap-2">
                      <button
                        onClick={() => navigate("/player/" + course._id)}
                        className={`btn btn-sm text-white ${
                          completed ? "btn-success" : "bg-[#547792]"
                        }`}
                        title={
                          completed ? "Curso concluído" : "Continuar a aprender"
                        }
                      >
                        {completed ? "Concluído" : "Em Progresso"}
                      </button>

                      {/* === NOVO: Botão Certificado, só ativo a 100% === */}
                      <button
                        onClick={() => handleDownloadCertificate(course)}
                        disabled={!completed}
                        className={`btn btn-sm ml-28 ${
                          completed
                            ? "btn-outline border-[#8EC6CA] text-[#8EC6CA] hover:bg-[#8EC6CA] hover:text-[#213448]"
                            : "btn-disabled"
                        }`}
                        title={
                          completed
                            ? "Descarregar certificado (PDF)"
                            : "Conclui todas as aulas para obter o certificado"
                        }
                      >
                        Certificado (PDF)
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>

        {/* Nota: o template de cada certificado está embutido e oculto na própria linha */}
      </div>
    </div>
  );
};

export default MyEnrollments;
