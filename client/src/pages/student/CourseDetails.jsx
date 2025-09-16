import React, { useContext, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { AppContext } from "../../context/AppContext";
import Loading from "../../components/student/Loading";
import { assets } from "../../assets/assets";
import humanizeDuration from "humanize-duration";
import YouTube from "react-youtube";
import axios from "axios";
import { toast } from "react-toastify";

const getYouTubeId = (input) => {
  if (!input) return null;
  const str = String(input).trim();
  if (/^[a-zA-Z0-9_-]{11}$/.test(str)) return str;
  try {
    const url = new URL(str);
    if (url.hostname.includes("youtu.be")) {
      const id = url.pathname.split("/").filter(Boolean)[0];
      return id || null;
    }
    const v = url.searchParams.get("v");
    if (v) return v;
    const parts = url.pathname.split("/").filter(Boolean);
    const ix = parts.findIndex((p) =>
      ["embed", "shorts", "live", "v"].includes(p)
    );
    if (ix !== -1 && parts[ix + 1]) return parts[ix + 1];
    return null;
  } catch {
    const m = str.match(/v=([^&]+)/);
    return m ? m[1] : null;
  }
};

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
      data.success ? setCourseData(data.courseData) : toast.error(data.message);
    } catch (error) {
      toast.error(error.message);
    }
  };

  const enrollCourse = async () => {
    try {
      if (!userData)
        return toast.error("Por favor inicia sessão para te inscreveres");
      if (isAlreadyEnrolled)
        return toast.warning("Já estás inscrito neste curso");

      const token = await getToken();
      const { data } = await axios.post(
        backendUrl + "/api/user/purchase",
        { courseId: courseData._id },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      data.success
        ? window.location.replace(data.session_url)
        : toast.error(data.message);
    } catch (error) {
      toast.error(error.message);
    }
  };

  useEffect(() => {
    fetchCourseData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (userData && courseData) {
      setIsAlreadyEnrolled(userData.enrolledCourses.includes(courseData._id));
    }
  }, [userData, courseData]);

  const toggleSection = (index) => {
    setOpenSections((prev) => ({ ...prev, [index]: !prev[index] }));
  };

  if (!courseData) return <Loading />;

  const ratingValue = calculateRating(courseData);
  const videoOpts = {
    width: "100%",
    height: "100%",
    playerVars: { autoplay: 1, rel: 0, modestbranding: 1, playsinline: 1 },
  }; // YouTube IFrame API params via react-youtube :contentReference[oaicite:1]{index=1}

  return (
    <main className="bg-white min-h-screen">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
        {/* Layout responsivo: 1 col → 2 col */}
        <div className="grid grid-cols-1 lg:grid-cols-[minmax(0,1fr)_420px] gap-8 items-start">
          {/* Coluna esquerda — conteúdo */}
          <section className="order-2 lg:order-1">
            <h1 className="text-2xl md:text-3xl font-semibold text-gray-800">
              {courseData?.courseTitle}
            </h1>

            <p
              className="pt-3 text-sm md:text-base text-gray-600"
              dangerouslySetInnerHTML={{
                __html: courseData.courseDescription.slice(0, 200),
              }}
            />

            {/* Rating + meta */}
            <div className="flex flex-wrap items-center gap-3 pt-3 pb-1 text-sm md:text-base">
              <p>{ratingValue}</p>
              <div className="flex">
                {[...Array(5)].map((_, index) => (
                  <img
                    key={index}
                    className="w-4 h-4"
                    src={
                      index < Math.floor(ratingValue)
                        ? assets.star
                        : assets.star_blank
                    }
                    alt={
                      index < Math.floor(ratingValue)
                        ? "estrela cheia"
                        : "estrela vazia"
                    }
                  />
                ))}
              </div>
              <p className="text-blue-600">
                ({courseData.courseRatings.length}{" "}
                {courseData.courseRatings.length > 1
                  ? "avaliações"
                  : "avaliação"}
                )
              </p>
              <span className="text-gray-700">
                {courseData.enrolledStudents.length}{" "}
                {courseData.enrolledStudents.length > 1 ? "alunos" : "aluno"}
              </span>
            </div>

            <p className="text-sm">
              Curso por{" "}
              <span className="text-blue-600 underline">
                {courseData.educator?.name}
              </span>
            </p>

            {/* Estrutura */}
            <div className="pt-8 text-gray-800">
              <h2 className="text-xl font-semibold">Estrutura do Curso</h2>

              <div className="pt-4 space-y-2">
                {courseData.courseContent.map((chapter, index) => {
                  const expanded = !!openSections[index];
                  const headingId = `ch-${index}`;
                  const panelId = `panel-${index}`;
                  return (
                    <div
                      className="border border-gray-300 bg-white rounded"
                      key={index}
                    >
                      <div role="heading" aria-level={3}>
                        <button
                          type="button"
                          id={headingId}
                          aria-controls={panelId}
                          aria-expanded={expanded}
                          onClick={() => toggleSection(index)}
                          className="w-full flex items-center justify-between px-4 py-3 bg-[#213448] text-[#D3DAD9] rounded-t"
                        >
                          <div className="flex items-center gap-2">
                            <img
                              src={assets.down_arrow_icon}
                              alt=""
                              className={`transition-transform ${
                                expanded ? "rotate-180" : ""
                              }`}
                            />
                            <p className="font-medium text-sm md:text-base">
                              {chapter.chapterTitle}
                            </p>
                          </div>
                          <p className="text-xs md:text-sm opacity-90">
                            {chapter.chapterContent.length} aulas •{" "}
                            {calculateChapterTime(chapter)}
                          </p>
                        </button>
                      </div>

                      <div
                        id={panelId}
                        role="region"
                        aria-labelledby={headingId}
                        className={`overflow-hidden transition-all duration-300 ${
                          expanded ? "max-h-[1000px]" : "max-h-0"
                        }`}
                      >
                        <ul className="md:pl-10 pl-4 pr-4 py-2 text-gray-700 border-t border-gray-300 space-y-1">
                          {chapter.chapterContent.map((lecture, i) => (
                            <li key={i} className="flex items-start gap-2 py-1">
                              <img
                                src={assets.play_icon}
                                alt="ícone play"
                                className="w-4 h-4 mt-1 flex-shrink-0"
                              />
                              <div className="flex items-center justify-between w-full text-gray-800 text-xs md:text-sm">
                                <p className="truncate">
                                  {lecture.lectureTitle}
                                </p>
                                <div className="flex items-center gap-3">
                                  {lecture.isPreviewFree && (
                                    <button
                                      onClick={() => {
                                        const vid = getYouTubeId(
                                          lecture.lectureUrl
                                        );
                                        if (!vid)
                                          return toast.error(
                                            "URL do vídeo inválida"
                                          );
                                        setPlayerData({ videoId: vid });
                                      }}
                                      className="text-blue-600 underline"
                                    >
                                      Pré-visualizar
                                    </button>
                                  )}
                                  <span className="text-gray-600">
                                    {humanizeDuration(
                                      lecture.lectureDuration * 60000,
                                      {
                                        units: ["h", "m"],
                                      }
                                    )}
                                  </span>
                                </div>
                              </div>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Descrição completa */}
            <section className="py-10 text-sm md:text-base">
              <h3 className="text-2xl md:text-3xl font-semibold text-gray-800">
                Descrição do Curso
              </h3>
              <div
                className="pt-3 rich-text text-gray-700"
                dangerouslySetInnerHTML={{
                  __html: courseData.courseDescription,
                }}
              />
            </section>
          </section>

          {/* Coluna direita — compra / vídeo */}
          <aside className="order-1 lg:order-2">
            <div className="rounded-lg border border-slate-200 overflow-hidden bg-white shadow-sm">
              {/* vídeo/thumb responsivo 16:9 */}
              <div className="relative w-full overflow-hidden aspect-video">
                {playerData ? (
                  <YouTube
                    videoId={playerData.videoId}
                    opts={videoOpts}
                    iframeClassName="absolute inset-0 w-full h-full"
                    onError={() =>
                      toast.error("Vídeo indisponível ou ID inválido")
                    }
                  />
                ) : (
                  <img
                    src={courseData.courseThumbnail}
                    alt="imagem curso"
                    className="absolute inset-0 w-full h-full object-cover"
                    loading="lazy"
                    decoding="async"
                  />
                )}
              </div>

              <div className="p-5">
                <div className="flex items-center gap-2">
                  <img
                    src={assets.time_left_clock_icon}
                    alt=""
                    className="w-4 h-4"
                  />
                  <p className="text-red-500">
                    <span className="font-medium">5 dias</span> restantes a este
                    preço!
                  </p>
                </div>

                <div className="flex flex-wrap items-baseline gap-3 pt-2">
                  <p className="text-2xl md:text-4xl text-gray-800 font-semibold">
                    {currency}{" "}
                    {(
                      courseData.coursePrice -
                      (courseData.discount * courseData.coursePrice) / 100
                    ).toFixed(2)}
                  </p>
                  <p className="text-lg text-gray-500 line-through">
                    {currency} {courseData.coursePrice.toFixed(2)}
                  </p>
                  <p className="text-lg text-gray-500">
                    {courseData.discount}% desconto
                  </p>
                </div>

                <div className="flex flex-wrap items-center gap-4 pt-3 text-gray-600 text-sm">
                  <span className="flex items-center gap-1">
                    <img src={assets.star} alt="" className="w-4 h-4" />
                    {ratingValue}
                  </span>
                  <span className="h-4 w-px bg-gray-300" />
                  <span className="flex items-center gap-1">
                    <img
                      src={assets.time_clock_icon}
                      alt=""
                      className="w-4 h-4"
                    />
                    {calculateCourseDuration(courseData)}
                  </span>
                  <span className="h-4 w-px bg-gray-300" />
                  <span className="flex items-center gap-1">
                    <img src={assets.lesson_icon} alt="" className="w-4 h-4" />
                    {calculateNoOfLectures(courseData)} aulas
                  </span>
                </div>

                <button
                  onClick={enrollCourse}
                  className="mt-4 md:mt-6 w-full h-11 rounded-md bg-[#547792] text-white font-medium hover:bg-[#547792]/90"
                >
                  {isAlreadyEnrolled ? "Já Inscrito" : "Inscreve-te Agora"}
                </button>

                <div className="pt-6">
                  <p className="text-lg md:text-xl font-medium text-gray-800">
                    O que está incluído no curso?
                  </p>
                  <ul className="ml-4 pt-2 text-sm md:text-base list-disc text-gray-600 space-y-1">
                    <li>Acesso vitalício com atualizações gratuitas</li>
                    <li>Guia passo a passo com projetos práticos</li>
                    <li>Recursos e código-fonte para download</li>
                    <li>Questionários para testares os teus conhecimentos</li>
                    <li>Certificado de conclusão incluído</li>
                  </ul>
                </div>
              </div>
            </div>
          </aside>
        </div>
      </div>
    </main>
  );
};

export default CourseDetails;
