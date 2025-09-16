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
    enrolledCourses = [],
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
          const completed = data?.progressData?.lectureCompleted?.length || 0;
          return { totalLectures: total || 1, lectureCompleted: completed };
        })
      );
      setProgressData(temp);
    } catch (error) {
      toast.error(error.message);
    }
  };

  useEffect(() => {
    if (userData) fetchUserEnrolledCourses();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userData]);

  useEffect(() => {
    if (enrolledCourses.length > 0) getCourseProgress();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [enrolledCourses]);

  // ——— PDF a partir de um template offscreen e estável
  const handleDownloadCertificate = async (course) => {
    try {
      const el = document.getElementById(`cert-${course._id}`);
      if (!el) return toast.error("Template do certificado não encontrado.");

      // Garantir dimensões estáveis para render
      const dataUrl = await htmlToImage.toPng(el, {
        pixelRatio: 2,
        cacheBust: true,
        backgroundColor: "#ffffff",
        style: {
          display: "block",
          width: "1123px",
          height: "794px",
          fontFamily:
            "Inter, ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto, Arial",
          color: "#111827",
          background: "#ffffff",
        },
      });

      const pdf = new jsPDF("landscape", "mm", "a4");
      const pageWidth = pdf.internal.pageSize.getWidth();
      const pageHeight = pdf.internal.pageSize.getHeight();

      // Escalar sem distorcer e centrado verticalmente
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
    <div className="min-h-screen w-full">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 pt-8 pb-14">
        <h1 className="text-2xl md:text-3xl font-semibold text-[#37353E]">
          Os Meus Cursos
        </h1>

        {/* ——— Lista MOBILE (cards) — aparece até md */}
        <div className="mt-6 grid grid-cols-1 gap-4 md:hidden">
          {enrolledCourses.map((course, idx) => {
            const prog = progressArray[idx] || {
              lectureCompleted: 0,
              totalLectures: 1,
            };
            const percent =
              (prog.lectureCompleted / Math.max(prog.totalLectures, 1)) * 100;
            const completed = percent >= 100;

            return (
              <article
                key={course._id}
                className="rounded-lg border border-slate-200 bg-white shadow-sm overflow-hidden"
              >
                <div className="flex gap-4 p-4">
                  <img
                    src={course.courseThumbnail}
                    alt=""
                    className="w-20 h-20 rounded-md object-cover flex-shrink-0"
                    loading="lazy"
                    decoding="async"
                  />
                  <div className="flex-1">
                    <h2 className="text-base font-medium">
                      {course.courseTitle}
                    </h2>
                    <p className="text-xs text-slate-600 mt-1">
                      {calculateCourseDuration(course)} ·{" "}
                      {prog.lectureCompleted}/{prog.totalLectures} aulas
                    </p>
                    <div className="mt-3">
                      <Line
                        strokeWidth={4}
                        percent={percent}
                        className="h-2 rounded-full"
                      />
                      <p className="mt-1 text-xs text-slate-600">
                        {Math.round(percent)}%
                      </p>
                    </div>
                  </div>
                </div>

                <div className="px-4 pb-4 flex flex-col sm:flex-row gap-2">
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

                  <button
                    onClick={() => handleDownloadCertificate(course)}
                    disabled={!completed}
                    className={`btn btn-sm ${
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

                {/* Template oculto do certificado (um por curso) */}
                <CertificateTemplate
                  id={`cert-${course._id}`}
                  courseTitle={course.courseTitle}
                  studentName={userData?.name}
                  duration={calculateCourseDuration(course)}
                />
              </article>
            );
          })}
        </div>

        {/* ——— Tabela DESKTOP — aparece em ≥ md */}
        <div className="mt-6 hidden md:block overflow-hidden rounded-lg border border-slate-200 bg-white shadow-sm">
          <div className="overflow-x-auto">
            <table className="table w-full table-zebra">
              <thead className="bg-[#213448] text-[#D3DAD9]">
                <tr>
                  <th className="whitespace-nowrap">Curso</th>
                  <th className="whitespace-nowrap">Duração</th>
                  <th className="whitespace-nowrap">Concluído</th>
                  <th className="whitespace-nowrap">Estado</th>
                </tr>
              </thead>

              <tbody className="">
                {enrolledCourses.map((course, idx) => {
                  const prog = progressArray[idx] || {
                    lectureCompleted: 0,
                    totalLectures: 1,
                  };
                  const percent =
                    (prog.lectureCompleted / Math.max(prog.totalLectures, 1)) *
                    100;
                  const completed = percent >= 100;

                  return (
                    <tr key={course._id} className="align-top">
                      <td>
                        <div className="flex items-center gap-4 min-w-[280px] ">
                          <img
                            src={course.courseThumbnail}
                            alt=""
                            className="w-16 h-16 rounded-lg object-cover"
                            loading="lazy"
                            decoding="async"
                          />
                          <div className="flex-1">
                            <p className="font-medium">{course.courseTitle}</p>
                            <div className="mt-2">
                              <Line
                                strokeWidth={4}
                                percent={percent}
                                className="h-2 rounded-full"
                              />
                              <p className="mt-1 text-xs text-slate-600">
                                {Math.round(percent)}%
                              </p>
                            </div>
                          </div>
                        </div>

                        {/* Template oculto por curso (offscreen mas renderizável) */}
                        <CertificateTemplate
                          id={`cert-${course._id}`}
                          courseTitle={course.courseTitle}
                          studentName={userData?.name}
                          duration={calculateCourseDuration(course)}
                        />
                      </td>

                      <td className="whitespace-nowrap">
                        {calculateCourseDuration(course)}
                      </td>
                      <td className="whitespace-nowrap">
                        {prog.lectureCompleted} / {prog.totalLectures}
                      </td>

                      <td>
                        <div className="flex flex-wrap gap-2">
                          <button
                            onClick={() => navigate("/player/" + course._id)}
                            className={`btn btn-sm text-white ${
                              completed ? "btn-success" : "bg-[#547792]"
                            }`}
                            title={
                              completed
                                ? "Curso concluído"
                                : "Continuar a aprender"
                            }
                          >
                            {completed ? "Concluído" : "Em Progresso"}
                          </button>

                          <button
                            onClick={() => handleDownloadCertificate(course)}
                            disabled={!completed}
                            className={`btn btn-sm ${
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
          </div>
        </div>

        <p className="sr-only">
          Nota: Em ecrãs pequenos, os cursos aparecem como cartões para melhor
          legibilidade.
        </p>
      </div>
    </div>
  );
};

// ——— Componente isolado do template do certificado (para reutilização)
const CertificateTemplate = ({ id, courseTitle, studentName, duration }) => {
  return (
    <div
      id={id}
      aria-hidden="true"
      style={{
        position: "absolute",
        left: "-99999px",
        top: 0,
        width: "1123px", // A4 horizontal ~96dpi
        height: "794px",
        padding: "48px",
        background: "white",
        border: "6px solid #1f2937",
        boxShadow: "0 10px 30px rgba(0,0,0,0.1)",
        fontFamily: "Inter, ui-sans-serif, system-ui, -apple-system",
        color: "#111827",
      }}
    >
      <div
        style={{
          position: "absolute",
          inset: "16px",
          border: "2px solid #9ca3af",
        }}
      />
      <header style={{ textAlign: "center", marginTop: 12, paddingTop: 48 }}>
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
        <h1 style={{ fontSize: 36, margin: "8px 0 0 0", fontWeight: 700 }}>
          Declaração de Conclusão
        </h1>
      </header>

      <main style={{ textAlign: "center", marginTop: 48 }}>
        <p style={{ fontSize: 16, color: "#374151" }}>Certifica-se que</p>
        <div style={{ fontSize: 32, fontWeight: 700, marginTop: 8 }}>
          {studentName || "Nome do Aluno"}
        </div>
        <p style={{ fontSize: 16, color: "#374151", marginTop: 16 }}>
          concluiu com aproveitamento o curso
        </p>
        <div style={{ fontSize: 24, fontWeight: 600, marginTop: 4 }}>
          {courseTitle}
        </div>
        <p style={{ fontSize: 16, color: "#374151", marginTop: 16 }}>
          com duração de <strong>{duration || "—"}</strong>, emitido em{" "}
          <strong>{new Date().toLocaleDateString("pt-PT")}</strong>.
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
  );
};

export default MyEnrollments;
