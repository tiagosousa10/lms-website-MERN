import React, { useContext, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { AppContext } from "../../context/AppContext";
import Loading from "../../components/student/Loading";
import { assets } from "../../assets/assets";
import humanizeDuration from "humanize-duration";
import YouTube from "react-youtube";
import axios from "axios";
import { toast } from "react-toastify";

const CourseDetails = () => {
  const { id } = useParams();

  const [courseData, setCourseData] = useState(null);
  const [openSections, setOpenSections] = useState({});
  const [isAlreadyEnrolled, setIsAlreadyEnrolled] = useState(false);
  const [playerData, setPlayerData] = useState(null);

  const {
    calculateRating,
    calculateChapterTime,
    calculateCourseDuration,
    calculateNoOfLectures,
    currency,
    backendUrl,
    userData,
    getToken,
  } = useContext(AppContext);

  const fetchCourseData = async () => {
    try {
      const { data } = await axios.get(backendUrl + "/api/course/" + id);
      if (data.success) {
        setCourseData(data.courseData);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  const enrollCourse = async () => {
    try {
      if (!userData) {
        return toast.error("Por favor inicia sessão para te inscreveres");
      }

      if (isAlreadyEnrolled) {
        return toast.warning("Já estás inscrito neste curso");
      }

      const token = await getToken();
      const { data } = await axios.post(
        backendUrl + "/api/user/purchase",
        { courseId: courseData._id },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (data.success) {
        const { session_url } = data;
        window.location.replace(session_url);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  useEffect(() => {
    fetchCourseData();
  }, []);

  useEffect(() => {
    if (userData && courseData) {
      setIsAlreadyEnrolled(userData.enrolledCourses.includes(courseData._id));
    }
  }, [userData, courseData]);

  const toggleSection = (index) => {
    setOpenSections((prev) => ({
      ...prev,
      [index]: !prev[index],
    }));
  };

  const getYouTubeId = (input) => {
    if (!input) return null;
    const str = String(input).trim();

    // já é só o ID?
    if (/^[a-zA-Z0-9_-]{11}$/.test(str)) return str;

    try {
      const url = new URL(str);

      // youtu.be/<id>
      if (url.hostname.includes("youtu.be")) {
        const id = url.pathname.split("/").filter(Boolean)[0];
        return id || null;
      }

      // youtube.com/watch?v=<id>
      const v = url.searchParams.get("v");
      if (v) return v;

      // /embed/<id>  | /shorts/<id> | /live/<id> | /v/<id>
      const parts = url.pathname.split("/").filter(Boolean);
      const ix = parts.findIndex((p) =>
        ["embed", "shorts", "live", "v"].includes(p)
      );
      if (ix !== -1 && parts[ix + 1]) return parts[ix + 1];

      return null;
    } catch {
      // string sem ser URL completa (fallback)
      const m = str.match(/v=([^&]+)/);
      return m ? m[1] : null;
    }
  };

  return courseData ? (
    <>
      <div className="flex md:flex-row flex-col-reverse gap-10 relative items-start justify-between md:px-36 px-8 md:pt-20 pt-10 text-left">
        <div className="absolute top-0 left-0 w-full h-section-height -z-1 "></div>

        <div className="max-w-xl z-10 text-gray-500">
          <h1 className="md:text-course-details-heading-large text-course-details-heading-small font-semibold text-gray-800">
            {courseData?.courseTitle}
          </h1>
          <p
            className="pt-4 md:text-base text-sm"
            dangerouslySetInnerHTML={{
              __html: courseData.courseDescription.slice(0, 200),
            }}
          ></p>

          <div className="flex items-center space-x-2 pt-3 pb-1 text-sm">
            <p>{calculateRating(courseData)}</p>
            <div className="flex">
              {[...Array(5)].map((_, index) => (
                <img
                  className="w-3.5 h-3.5"
                  key={index}
                  src={
                    index < Math.floor(calculateRating(courseData))
                      ? assets.star
                      : assets.star_blank
                  }
                  alt=""
                />
              ))}
            </div>

            <p className="text-blue-600">
              ({courseData.courseRatings.length}{" "}
              {courseData.length > 1 ? "avaliações" : "avaliação"})
            </p>

            <p>
              {courseData.enrolledStudents.length}{" "}
              {courseData.enrolledStudents.length > 1 ? "alunos" : "aluno"}
            </p>
          </div>
          <p className="text-sm">
            Curso por{" "}
            <span className="text-blue-600 underline">
              {courseData.educator?.name}
            </span>
          </p>

          <div className="pt-8 text-gray-800">
            <h2 className="text-xl font-semibold">Estrutura do Curso</h2>
            <div className="pt-5">
              {courseData.courseContent.map((chapter, index) => (
                <div
                  className="border border-gray-300 bg-white mb-2 rounded"
                  key={index}
                >
                  <div
                    className="flex items-center justify-between px-4 py-3 cursor-pointer select-none bg-[#213448] text-[#D3DAD9]"
                    onClick={() => toggleSection(index)}
                  >
                    <div className="flex items-center gap-2 bg-[#213448]">
                      <img
                        src={assets.down_arrow_icon}
                        alt="ícone seta"
                        className={`transform transition-transform ${
                          openSections[index] ? "rotate-180" : ""
                        }`}
                      />
                      <p className="font-medium md:text-base text-sm">
                        {chapter.chapterTitle}
                      </p>
                    </div>

                    <p className="text-sm md:text-default">
                      {chapter.chapterContent.length} aulas -{" "}
                      {calculateChapterTime(chapter)}
                    </p>
                  </div>

                  <div
                    className={`overflow-hidden transition-all duration-300 ${
                      openSections[index] ? "max-h-96" : "max-h-0"
                    }`}
                  >
                    <ul className="list-disc md:pl-10 pl-4 pr-4 py-2 text-gray-600 border-t border-gray-300">
                      {chapter.chapterContent.map((lecture, index) => (
                        <li key={index} className="flex items-start gap-2 py-1">
                          <img
                            src={assets.play_icon}
                            alt="ícone play"
                            className="w-4 h-4 mt-1"
                          />
                          <div className="flex items-center justify-between w-full text-gray-800 text-xs md:text-default">
                            <p>{lecture.lectureTitle}</p>
                            <div className="flex gap-2">
                              {lecture.isPreviewFree && (
                                <p
                                  onClick={() => {
                                    const id = getYouTubeId(lecture.lectureUrl);
                                    if (!id)
                                      return toast.error(
                                        "URL do vídeo inválida"
                                      );
                                    setPlayerData({ videoId: id });
                                  }}
                                  className="text-blue-500 cursor-pointer"
                                >
                                  Pré-visualizar
                                </p>
                              )}

                              <p>
                                {humanizeDuration(
                                  lecture.lectureDuration * 60 * 1000,
                                  { units: ["h", "m"] }
                                )}
                              </p>
                            </div>
                          </div>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="py-20 text-sm md:text-default">
            <h3 className="text-3xl font-semibold text-gray-800">
              Descrição do Curso
            </h3>
            <p
              className="pt-3 rich-text"
              dangerouslySetInnerHTML={{ __html: courseData.courseDescription }}
            ></p>
          </div>
        </div>

        <div className="max-w-course-card z-10 shadow-custom-card rounded-t md:rounded-none overflow-hidden bg-white min-w-[300px] sm:min-w-[420px]">
          {playerData ? (
            <YouTube
              videoId={playerData.videoId}
              opts={{ playerVars: { autoplay: 1 } }}
              iframeClassName="w-full aspect-video"
              onError={() => toast.error("Vídeo indisponível ou ID inválido")}
            />
          ) : (
            <img src={courseData.courseThumbnail} alt="imagem curso" />
          )}
          <div className="p-5">
            <div className="flex items-center gap-2">
              <img
                src={assets.time_left_clock_icon}
                alt="ícone tempo"
                className="w-3.5"
              />
              <p className="text-red-500">
                <span className="font-medium">5 dias</span> restantes a este
                preço!
              </p>
            </div>

            <div className="flex gap-3 items-center pt-2">
              <p className="text-gray-800 md:text-4xl text-2xl font-semibold">
                {currency}{" "}
                {(
                  courseData.coursePrice -
                  (courseData.discount * courseData.coursePrice) / 100
                ).toFixed(2)}
              </p>
              <p className="md:text-lg text-gray-500 line-through">
                {currency} {courseData.coursePrice.toFixed(2)}
              </p>
              <p className="md:text-lg text-gray-500">
                {courseData.discount}% desconto
              </p>
            </div>

            <div className="flex items-center text-sm md:text-default gap-4 pt-2 md:pt-4 text-gray-500">
              <div className="flex items-center gap-1">
                <img src={assets.star} alt="ícone estrela" />
                <p>{calculateRating(courseData)}</p>
              </div>
              <div className="h-4 w-px bg-gray-500/400"></div>
              <div className="flex items-center gap-1">
                <img src={assets.time_clock_icon} alt="ícone relógio" />
                <p>{calculateCourseDuration(courseData)}</p>
              </div>
              <div className="h-4 w-px bg-gray-500/400"></div>
              <div className="flex items-center gap-1">
                <img src={assets.lesson_icon} alt="ícone aula" />
                <p>{calculateNoOfLectures(courseData)} aulas</p>
              </div>
            </div>

            <button
              onClick={enrollCourse}
              className="md:mt-6 mt-4 w-full py-3 rounded bg-[#547792] text-white font-medium "
            >
              {isAlreadyEnrolled ? "Já Inscrito" : "Inscreve-te Agora"}
            </button>

            <div className="pt-6">
              <p className="md:text-xl text-lg font-medium text-gray-800">
                O que está incluído no curso?
              </p>
              <ul className="ml-4 pt-2 text-sm md:text-default list-disc text-gray-500 mb-2">
                <li>Acesso vitalício com atualizações gratuitas</li>
                <li>Guia passo a passo com projetos práticos</li>
                <li>Recursos e código-fonte para download</li>
                <li>Questionários para testares os teus conhecimentos</li>
                <li>Certificado de conclusão incluído</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </>
  ) : (
    <Loading />
  );
};

export default CourseDetails;
