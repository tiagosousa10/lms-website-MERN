import React, { useContext, useEffect, useState } from "react";
import { AppContext } from "../../context/AppContext";
import YouTube from "react-youtube";
import { assets } from "../../assets/assets";
import { useParams } from "react-router-dom";
import humanizeDuration from "humanize-duration";
import axios from "axios";
import { toast } from "react-toastify";
import Rating from "../../components/student/Rating";
import Loading from "../../components/student/Loading";

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
                      const done = progressData?.lectureCompleted.includes(
                        lec.lectureId
                      );
                      return (
                        <div key={i}>
                          <div className="px-5 py-4 flex items-start gap-3">
                            <img
                              src={
                                done ? assets.blue_tick_icon : assets.play_icon
                              }
                              className="w-[19px] h-[19px] mt-0.5"
                              alt={done ? "Concluída" : "Por ver"}
                            />
                            <div className="flex-1 min-w-0">
                              <div className="text-[15px] text-[#232323] mb-3 truncate">
                                {lec.lectureTitle}
                              </div>
                              <div className="flex items-center justify-between gap-3 flex-wrap">
                                <div className="flex items-center gap-2">
                                  {lec.lectureUrl && (
                                    <button
                                      onClick={() =>
                                        setPlayerData({
                                          ...lec,
                                          chapter: idx + 1,
                                          lecture: i + 1,
                                        })
                                      }
                                      className="h-7 px-3 rounded-[10px] bg-[#547792] text-[#d3dad9] text-sm hover:bg-[#547792]/85 transition"
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
              <div className="w-full aspect-video border border-black rounded-[7px] overflow-hidden">
                <YouTube
                  iframeClassName="w-full h-full"
                  videoId={playerData.lectureUrl.split("/").pop()}
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
                    progressData?.lectureCompleted.includes(
                      playerData.lectureId
                    )
                      ? "bg-[#22c55e] text-white hover:bg-[#16a34a]"
                      : "bg-[#547792] text-white hover:bg-[#547792]/85"
                  }`}
                >
                  {progressData?.lectureCompleted.includes(playerData.lectureId)
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
