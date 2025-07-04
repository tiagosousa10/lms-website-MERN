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
    <div className=" min-h-screen p-4 md:p-10 space-y-8">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Left: Estrutura do Curso */}
        <div className="space-y-6">
          <h2 className="text-2xl font-semibold text-base-content">
            Estrutura do Curso
          </h2>
          <div className="space-y-4">
            {courseData.courseContent.map((chapter, idx) => (
              <div key={idx} className="card bg-base-100 shadow">
                <div
                  className="card-title flex justify-between items-center cursor-pointer p-4"
                  onClick={() => toggleSection(idx)}
                >
                  <div className="flex items-center gap-2">
                    <img
                      src={assets.down_arrow_icon}
                      className={`w-4 h-4 transition-transform ${
                        openSections[idx] ? "rotate-180" : ""
                      }`}
                    />
                    <span className="font-medium">{chapter.chapterTitle}</span>
                  </div>
                  <span className="text-sm">
                    {chapter.chapterContent.length} aulas •{" "}
                    {calculateChapterTime(chapter)}
                  </span>
                </div>
                {openSections[idx] && <div className="divider my-0" />}
                <div
                  className={`overflow-hidden transition-all duration-300 ${
                    openSections[idx] ? "max-h-screen" : "max-h-0"
                  }`}
                >
                  <ul className="menu bg-base-100 p-4 space-y-2">
                    {chapter.chapterContent.map((lec, i) => (
                      <li key={i} className="flex justify-between items-center">
                        <div className="flex items-center gap-2">
                          <img
                            src={
                              progressData?.lectureCompleted.includes(
                                lec.lectureId
                              )
                                ? assets.blue_tick_icon
                                : assets.play_icon
                            }
                            className="w-4 h-4"
                          />
                          <span>{lec.lectureTitle}</span>
                        </div>
                        <div className="flex items-center gap-4">
                          {lec.lectureUrl && (
                            <button
                              onClick={() =>
                                setPlayerData({
                                  ...lec,
                                  chapter: idx + 1,
                                  lecture: i + 1,
                                })
                              }
                              className="btn btn-xs btn-ghost text-blue-600"
                            >
                              Ver aula
                            </button>
                          )}
                          <span className="text-xs">
                            {humanizeDuration(lec.lectureDuration * 60000, {
                              units: ["h", "m"],
                            })}
                          </span>
                        </div>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
          </div>
          <div className="pt-4 border-t border-base-300 flex items-center gap-4">
            <h3 className="text-xl font-semibold">Avalia este curso:</h3>
            <Rating initialRating={initialRating} onRate={handleRate} />
          </div>
        </div>

        {/* Right: Player / Thumbnail */}
        <div>
          {playerData ? (
            <div className="space-y-4">
              <YouTube
                iframeClassName="w-full aspect-video rounded-lg shadow"
                videoId={playerData.lectureUrl.split("/").pop()}
              />
              <div className="flex justify-between items-center">
                <span className="font-semibold">
                  {playerData.chapter}.{playerData.lecture}{" "}
                  {playerData.lectureTitle}
                </span>
                <button
                  onClick={() => marcarComoConcluida(playerData.lectureId)}
                  className={
                    progressData?.lectureCompleted.includes(
                      playerData.lectureId
                    )
                      ? "btn btn-sm btn-success"
                      : "btn btn-sm btn-primary"
                  }
                >
                  {progressData?.lectureCompleted.includes(playerData.lectureId)
                    ? "Concluída"
                    : "Marcar como concluída"}
                </button>
              </div>
            </div>
          ) : (
            <img
              src={courseData.courseThumbnail}
              alt="Curso"
              className="rounded-lg shadow w-full"
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default Player;
