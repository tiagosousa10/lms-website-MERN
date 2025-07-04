import React, { useContext, useEffect, useRef, useState } from "react";
import uniqid from "uniqid";
import Quill from "quill";
import { assets } from "../../assets/assets";
import { AppContext } from "../../context/AppContext";
import { toast } from "react-toastify";
import axios from "axios";

const AddCourse = () => {
  const { backendUrl, getToken } = useContext(AppContext);
  const quillRef = useRef(null);
  const editorRef = useRef(null);

  const [courseTitle, setCourseTitle] = useState("");
  const [coursePrice, setCoursePrice] = useState(0);
  const [discount, setDiscount] = useState(0);
  const [image, setImage] = useState(null);
  const [chapters, setChapters] = useState([]);
  const [showPopup, setShowPopup] = useState(false);
  const [currentChapterId, setCurrentChapterId] = useState(null);

  const [lectureDetails, setLectureDetails] = useState({
    lectureTitle: "",
    lectureDuration: "",
    lectureUrl: "",
    isPreviewFree: false,
  });

  useEffect(() => {
    if (!quillRef.current && editorRef.current) {
      quillRef.current = new Quill(editorRef.current, { theme: "snow" });
    }
  }, []);

  const handleChapter = (action, chapterId) => {
    if (action === "add") {
      const title = prompt("Nome do Módulo:");
      if (title) {
        const newChapter = {
          chapterId: uniqid(),
          chapterTitle: title,
          chapterContent: [],
          collapsed: false,
          chapterOrder:
            chapters.length > 0 ? chapters.slice(-1)[0].chapterOrder + 1 : 1,
        };
        setChapters([...chapters, newChapter]);
      }
    } else if (action === "remove") {
      setChapters(chapters.filter((ch) => ch.chapterId !== chapterId));
    } else if (action === "toggle") {
      setChapters(
        chapters.map((ch) =>
          ch.chapterId === chapterId ? { ...ch, collapsed: !ch.collapsed } : ch
        )
      );
    }
  };

  const handleLecture = (action, chapterId, lectureIndex) => {
    if (action === "add") {
      setCurrentChapterId(chapterId);
      setShowPopup(true);
    } else if (action === "remove") {
      setChapters(
        chapters.map((chapter) => {
          if (chapter.chapterId === chapterId) {
            chapter.chapterContent.splice(lectureIndex, 1);
          }
          return chapter;
        })
      );
    }
  };

  const addLecture = () => {
    setChapters(
      chapters.map((chapter) => {
        if (chapter.chapterId === currentChapterId) {
          const newLecture = {
            ...lectureDetails,
            lectureOrder:
              chapter.chapterContent.length > 0
                ? chapter.chapterContent.slice(-1)[0].lectureOrder + 1
                : 1,
            lectureId: uniqid(),
          };
          chapter.chapterContent.push(newLecture);
        }
        return chapter;
      })
    );
    setShowPopup(false);
    setLectureDetails({
      lectureTitle: "",
      lectureDuration: "",
      lectureUrl: "",
      isPreviewFree: false,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!image) return toast.error("Miniatura não selecionada");

    const courseData = {
      courseTitle,
      courseDescription: quillRef.current.root.innerHTML,
      coursePrice: Number(coursePrice),
      discount: Number(discount),
      courseContent: chapters,
    };

    const formData = new FormData();
    formData.append("courseData", JSON.stringify(courseData));
    formData.append("image", image);

    try {
      const token = await getToken();
      const { data } = await axios.post(
        `${backendUrl}/api/educator/add-course`,
        formData,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (data.success) {
        toast.success(data.message);
        setCourseTitle("");
        setCoursePrice(0);
        setDiscount(0);
        setImage(null);
        setChapters([]);
        quillRef.current.root.innerHTML = "";
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  return (
    <div className="min-h-screen bg-base-200 p-4 md:p-8">
      <form onSubmit={handleSubmit} className="space-y-6 max-w-3xl w-full">
        <div className="form-control">
          <label className="label">Título do Curso</label>
          <input
            type="text"
            value={courseTitle}
            onChange={(e) => setCourseTitle(e.target.value)}
            placeholder="Escreve aqui"
            className="input input-bordered w-full"
            required
          />
        </div>

        <div className="form-control">
          <label className="label">Descrição do Curso</label>
          <div
            ref={editorRef}
            className="bg-white border border-base-300 rounded p-2"
          ></div>
        </div>

        <div className="flex flex-wrap gap-6">
          <div className="form-control w-36">
            <label className="label">Preço (€)</label>
            <input
              type="number"
              value={coursePrice}
              onChange={(e) => setCoursePrice(e.target.value)}
              placeholder="0"
              className="input input-bordered"
              required
            />
          </div>

          <div className="form-control w-36">
            <label className="label">Desconto %</label>
            <input
              type="number"
              value={discount}
              onChange={(e) => setDiscount(e.target.value)}
              min={0}
              max={100}
              placeholder="0"
              className="input input-bordered"
            />
          </div>

          <div className="form-control">
            <label className="label">Miniatura</label>
            <label htmlFor="thumbnailImage" className="cursor-pointer">
              <div className="btn btn-outline flex items-center gap-2">
                <img src={assets.file_upload_icon} className="w-5 h-5" />
                <span>Upload</span>
              </div>
              <input
                type="file"
                id="thumbnailImage"
                onChange={(e) => setImage(e.target.files[0])}
                accept="image/*"
                hidden
              />
            </label>
            {image && (
              <img
                src={URL.createObjectURL(image)}
                className="mt-2 h-10 rounded border border-base-300"
              />
            )}
          </div>
        </div>

        {/* Módulos e Aulas */}
        <div className="space-y-4">
          {chapters.map((chapter, chapterIndex) => (
            <div
              key={chapterIndex}
              className="card bg-base-100 border border-base-300"
            >
              <div className="card-body p-4">
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      className="btn btn-xs btn-circle"
                      onClick={() => handleChapter("toggle", chapter.chapterId)}
                    >
                      ▼
                    </button>
                    <h3 className="font-bold">
                      {chapterIndex + 1}. {chapter.chapterTitle}
                    </h3>
                  </div>
                  <div className="flex gap-3">
                    <span className="badge badge-outline">
                      {chapter.chapterContent.length} Aulas
                    </span>
                    <button
                      type="button"
                      onClick={() => handleChapter("remove", chapter.chapterId)}
                      className="btn btn-sm btn-error btn-outline"
                    >
                      Remover
                    </button>
                  </div>
                </div>

                {!chapter.collapsed && (
                  <div className="mt-4 space-y-2">
                    {chapter.chapterContent.map((lecture, index) => (
                      <div
                        key={index}
                        className="flex justify-between items-center border p-2 rounded"
                      >
                        <p className="text-sm">
                          {index + 1}. {lecture.lectureTitle} -{" "}
                          {lecture.lectureDuration} min -{" "}
                          <a
                            href={lecture.lectureUrl}
                            className="link"
                            target="_blank"
                          >
                            Link
                          </a>{" "}
                          - {lecture.isPreviewFree ? "Prévia gratuita" : "Pago"}
                        </p>
                        <button
                          onClick={() =>
                            handleLecture("remove", chapter.chapterId, index)
                          }
                          className="btn btn-xs btn-circle btn-error"
                        >
                          ✕
                        </button>
                      </div>
                    ))}
                    <button
                      type="button"
                      onClick={() => handleLecture("add", chapter.chapterId)}
                      className="btn btn-sm btn-outline"
                    >
                      + Adicionar Aula
                    </button>
                  </div>
                )}
              </div>
            </div>
          ))}

          <button
            type="button"
            onClick={() => handleChapter("add")}
            className="btn btn-outline w-full"
          >
            + Adicionar Módulo
          </button>
        </div>

        {/* Pop-up para nova aula */}
        {showPopup && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
            <div className="modal-box w-full max-w-sm">
              <h3 className="font-bold text-lg mb-4">Nova Aula</h3>

              <input
                type="text"
                placeholder="Título"
                className="input input-bordered w-full mb-3"
                value={lectureDetails.lectureTitle}
                onChange={(e) =>
                  setLectureDetails({
                    ...lectureDetails,
                    lectureTitle: e.target.value,
                  })
                }
              />
              <input
                type="number"
                placeholder="Duração (min)"
                className="input input-bordered w-full mb-3"
                value={lectureDetails.lectureDuration}
                onChange={(e) =>
                  setLectureDetails({
                    ...lectureDetails,
                    lectureDuration: e.target.value,
                  })
                }
              />
              <input
                type="text"
                placeholder="URL"
                className="input input-bordered w-full mb-3"
                value={lectureDetails.lectureUrl}
                onChange={(e) =>
                  setLectureDetails({
                    ...lectureDetails,
                    lectureUrl: e.target.value,
                  })
                }
              />
              <label className="label cursor-pointer justify-start gap-2 mb-3">
                <input
                  type="checkbox"
                  className="checkbox"
                  checked={lectureDetails.isPreviewFree}
                  onChange={(e) =>
                    setLectureDetails({
                      ...lectureDetails,
                      isPreviewFree: e.target.checked,
                    })
                  }
                />
                <span className="label-text">Pré-visualização gratuita?</span>
              </label>

              <div className="flex justify-between mt-4">
                <button onClick={addLecture} className="btn btn-primary w-full">
                  Adicionar Aula
                </button>
              </div>
              <button
                onClick={() => setShowPopup(false)}
                className="btn btn-sm btn-circle absolute top-2 right-2"
              >
                ✕
              </button>
            </div>
          </div>
        )}

        <button type="submit" className="btn btn-primary mt-6">
          Publicar Curso
        </button>
      </form>
    </div>
  );
};

export default AddCourse;
