// pages/Player.jsx
import React, { useContext, useEffect, useState, useMemo } from "react";
import { AppContext } from "../../context/AppContext";
import YouTube from "react-youtube";
import { assets } from "../../assets/assets";
import { useParams } from "react-router-dom";
import humanizeDuration from "humanize-duration";
import axios from "axios";
import { toast } from "react-toastify";
import Rating from "../../components/student/Rating";
import Loading from "../../components/student/Loading";

/** === Helper robusto para extrair o ID do YouTube === */
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

const Player = () => {
  const {
    enrolledCourses,
    backendUrl,
    getToken,
    calculateChapterTime,
    userData,
    fetchUserEnrolledCourses,
  } = useContext(AppContext);
  const { courseId } = useParams();

  const [courseData, setCourseData] = useState(null);
  const [progressData, setProgressData] = useState(null);
  const [openSections, setOpenSections] = useState({});
  const [playerData, setPlayerData] = useState(null);
  const [initialRating, setInitialRating] = useState(0);

  const getCourseData = () => {
    enrolledCourses.forEach((c) => {
      if (c._id === courseId) {
        setCourseData(c);
        const existing = c.courseRatings.find(
          (item) => item.userId === userData?._id
        );
        setInitialRating(existing?.rating || 0);
      }
    });
  };

  const toggleSection = (i) => setOpenSections((s) => ({ ...s, [i]: !s[i] }));

  useEffect(() => {
    if (enrolledCourses.length) getCourseData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [enrolledCourses]);

  const getCourseProgress = async () => {
    try {
      const token = await getToken();
      const { data } = await axios.post(
        `${backendUrl}/api/user/get-course-progress`,
        { courseId },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      if (data.success) setProgressData(data.progressData);
    } catch (err) {
      toast.error(err.message);
    }
  };

  useEffect(() => {
    getCourseProgress();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const marcarComoConcluida = async (lectureId) => {
    try {
      const token = await getToken();
      const { data } = await axios.post(
        `${backendUrl}/api/user/update-course-progress`,
        { courseId, lectureId },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      data.success ? toast.success(data.message) : toast.error(data.message);
      getCourseProgress();
    } catch (err) {
      toast.error(err.message);
    }
  };

  const handleRate = async (rating) => {
    try {
      const token = await getToken();
      const { data } = await axios.post(
        `${backendUrl}/api/user/add-rating`,
        { courseId, rating },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      data.success ? toast.success(data.message) : toast.error(data.message);
      fetchUserEnrolledCourses();
    } catch (err) {
      toast.error(err.message);
    }
  };

  if (!courseData) return <Loading />;

  return (
    <div className="bg-white min-h-screen">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-6 md:py-10">
        {/* topo: título do curso (mobile) */}
        <h1 className="md:hidden text-lg font-semibold mb-3">
          {courseData.courseTitle}
        </h1>

        {/* layout responsivo: em mobile player em cima; em ≥md duas colunas */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
          {/* Right (em mobile fica primeiro): Player / Thumbnail */}
          <div className="order-1 md:order-2">
            {playerData ? (
              <div className="space-y-4">
                {/* wrapper responsivo 16:9 */}
                <div className="relative w-full overflow-hidden rounded-lg border border-slate-300 aspect-video">
                  <YouTube
                    videoId={playerData.videoId}
                    iframeClassName="absolute inset-0 w-full h-full"
                    opts={{
                      width: "100%",
                      height: "100%",
                      playerVars: {
                        autoplay: 0,
                        rel: 0,
                        modestbranding: 1,
                        playsinline: 1,
                      },
                    }}
                    onError={() =>
                      toast.error("Vídeo indisponível ou ID inválido")
                    }
                  />
                </div>

                <div className="flex flex-col sm:flex-row gap-3 sm:items-center sm:justify-between">
                  <span className="font-semibold text-[#111827]">
                    {playerData.chapter}.{playerData.lecture}{" "}
                    {playerData.lectureTitle}
                  </span>

                  <button
                    onClick={() => marcarComoConcluida(playerData.lectureId)}
                    className={`h-9 px-4 rounded-md text-sm transition ${
                      progressData?.lectureCompleted?.includes(
                        playerData.lectureId
                      )
                        ? "bg-[#22c55e] text-white hover:bg-[#16a34a]"
                        : "bg-[#547792] text-white hover:bg-[#547792]/85"
                    }`}
                  >
                    {progressData?.lectureCompleted?.includes(
                      playerData.lectureId
                    )
                      ? "Concluída"
                      : "Marcar como concluída"}
                  </button>
                </div>
              </div>
            ) : (
              <div className="relative w-full overflow-hidden rounded-lg border border-slate-300 aspect-video">
                <img
                  src={courseData.courseThumbnail}
                  alt="Curso"
                  className="absolute inset-0 w-full h-full object-cover"
                  loading="lazy"
                  decoding="async"
                />
              </div>
            )}
          </div>

          {/* Left: Estrutura do Curso */}
          <div className="order-2 md:order-1 space-y-5">
            <h2 className="hidden md:block text-2xl md:text-3xl font-semibold text-[#37353e]">
              Estrutura do Curso
            </h2>

            <div className="space-y-3">
              {courseData.courseContent.map((chapter, idx) => {
                const sectionId = `section-${idx}`;
                const panelId = `panel-${idx}`;
                const expanded = !!openSections[idx];

                return (
                  <div key={idx} className="rounded-xl overflow-hidden">
                    {/* Trigger da secção (acessível) */}
                    <div role="heading" aria-level={3}>
                      <button
                        type="button"
                        aria-expanded={expanded}
                        aria-controls={panelId}
                        id={sectionId}
                        onClick={() => toggleSection(idx)}
                        className="w-full flex items-center justify-between bg-[#213448] text-white rounded-xl border border-[#d3dad9] px-5 py-3 hover:opacity-95 transition"
                      >
                        <div className="flex items-center gap-3">
                          <img
                            src={assets.down_arrow_icon}
                            className={`w-4 h-4 transition-transform ${
                              expanded ? "rotate-180" : ""
                            }`}
                            alt=""
                          />
                          <span className="text-base md:text-lg">
                            {chapter.chapterTitle}
                          </span>
                        </div>
                        <span className="text-xs opacity-85">
                          {chapter.chapterContent.length} aulas •{" "}
                          {calculateChapterTime(chapter)}
                        </span>
                      </button>
                    </div>

                    {/* Conteúdo da secção */}
                    <div
                      id={panelId}
                      role="region"
                      aria-labelledby={sectionId}
                      className={`transition-all duration-300 ${
                        expanded ? "max-h-[2000px]" : "max-h-0"
                      } overflow-hidden`}
                    >
                      <div className="border border-t-0 border-[#d3dad9] rounded-b-xl bg-white">
                        {chapter.chapterContent.map((lec, i) => {
                          const isCompleted = Boolean(
                            progressData?.lectureCompleted?.includes(
                              lec.lectureId
                            )
                          );
                          const ytId = getYouTubeId(lec.lectureUrl);

                          return (
                            <div key={i}>
                              <div className="px-5 py-4 flex items-start gap-3">
                                <img
                                  src={
                                    isCompleted
                                      ? assets.blue_tick_icon
                                      : assets.play_icon
                                  }
                                  className="w-[19px] h-[19px] mt-0.5"
                                  alt={isCompleted ? "Concluída" : "Por ver"}
                                />
                                <div className="flex-1 min-w-0">
                                  <div className="text-[15px] text-[#232323] mb-3 truncate">
                                    {lec.lectureTitle}
                                  </div>
                                  <div className="flex items-center justify-between gap-3 flex-wrap">
                                    <div className="flex items-center gap-2">
                                      {!!lec.lectureUrl && (
                                        <button
                                          onClick={() => {
                                            if (!ytId) {
                                              toast.error(
                                                "URL do vídeo inválida"
                                              );
                                              return;
                                            }
                                            setPlayerData({
                                              videoId: ytId,
                                              lectureId: lec.lectureId,
                                              lectureTitle: lec.lectureTitle,
                                              chapter: idx + 1,
                                              lecture: i + 1,
                                            });
                                          }}
                                          disabled={!ytId}
                                          className={`h-8 px-3 rounded-md text-sm transition ${
                                            ytId
                                              ? "bg-[#547792] text-[#d3dad9] hover:bg-[#547792]/85"
                                              : "bg-gray-300 text-gray-600 cursor-not-allowed"
                                          }`}
                                        >
                                          Assistir
                                        </button>
                                      )}
                                    </div>
                                    <span className="text-sm text-black/80">
                                      {humanizeDuration(
                                        lec.lectureDuration * 60000,
                                        { units: ["h", "m"] }
                                      )}
                                    </span>
                                  </div>
                                </div>
                              </div>

                              {i < chapter.chapterContent.length - 1 && (
                                <div className="h-px bg-[#e5e7eb] mx-5" />
                              )}
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="pt-4 border-t border-[#e5e7eb] flex items-center gap-4">
              <h3 className="text-lg md:text-xl font-semibold">
                Avalia este curso:
              </h3>
              <Rating initialRating={initialRating} onRate={handleRate} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Player;
