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

    // /embed/<id> | /shorts/<id> | /live/<id> | /v/<id>
    const parts = url.pathname.split("/").filter(Boolean);
    const ix = parts.findIndex((p) =>
      ["embed", "shorts", "live", "v"].includes(p)
    );
    if (ix !== -1 && parts[ix + 1]) return parts[ix + 1];

    return null;
  } catch {
    // string sem URL completa (fallback)
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
    <div className="bg-white min-h-screen p-4 md:p-10">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Left: Estrutura do Curso */}
        <div className="space-y-6">
          <h2 className="text-3xl font-semibold text-[#37353e]">
            Estrutura do Curso
          </h2>

          <div className="space-y-3">
            {courseData.courseContent.map((chapter, idx) => (
              <div key={idx} className="rounded-xl overflow-hidden">
                {/* Trigger da secção (mantém toggleSection) */}
                <button
                  type="button"
                  onClick={() => toggleSection(idx)}
                  className="w-full flex items-center justify-between bg-[#213448] text-white rounded-xl border border-[#d3dad9] px-5 py-3 hover:opacity-95 transition"
                >
                  <div className="flex items-center gap-3">
                    <img
                      src={assets.down_arrow_icon}
                      className={`w-4 h-4 transition-transform ${
                        openSections[idx] ? "rotate-180" : ""
                      }`}
                      alt=""
                    />
                    <span className="text-lg">{chapter.chapterTitle}</span>
                  </div>
                  <span className="text-xs opacity-80">
                    {chapter.chapterContent.length} aulas •{" "}
                    {calculateChapterTime(chapter)}
                  </span>
                </button>

                {/* Conteúdo da secção */}
                <div
                  className={`transition-all duration-300 ${
                    openSections[idx] ? "max-h-[2000px]" : "max-h-0"
                  } overflow-hidden`}
                >
                  <div className="border border-t-0 border-[#d3dad9] rounded-b-xl bg-white">
                    {chapter.chapterContent.map((lec, i) => {
                      const isCompleted = Boolean(
                        progressData?.lectureCompleted?.includes(lec.lectureId)
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
                                  {lec.lectureUrl && (
                                    <button
                                      onClick={() => {
                                        if (!ytId) {
                                          toast.error("URL do vídeo inválida");
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
                                      className={`h-7 px-3 rounded-[10px] text-sm transition ${
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
                                    {
                                      units: ["h", "m"],
                                    }
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
            ))}
          </div>

          <div className="pt-4 border-t border-[#e5e7eb] flex items-center gap-4">
            <h3 className="text-xl font-semibold">Avalia este curso:</h3>
            <Rating initialRating={initialRating} onRate={handleRate} />
          </div>
        </div>

        {/* Right: Player / Thumbnail */}
        <div>
          {playerData ? (
            <div className="space-y-4">
              <div className="w-full border border-black rounded-[7px] overflow-hidden relative aspect-video">
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

              <div className="flex flex-col sm:flex-row gap-3 sm:gap-0 sm:items-center sm:justify-between">
                <span className="font-semibold text-[#111827]">
                  {playerData.chapter}.{playerData.lecture}{" "}
                  {playerData.lectureTitle}
                </span>

                <button
                  onClick={() => marcarComoConcluida(playerData.lectureId)}
                  className={`h-9 px-4 rounded-[10px] text-sm transition ${
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
            <div className="w-full border border-black rounded-[7px] overflow-hidden">
              <img
                src={courseData.courseThumbnail}
                alt="Curso"
                className="w-full h-full object-cover"
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Player;
