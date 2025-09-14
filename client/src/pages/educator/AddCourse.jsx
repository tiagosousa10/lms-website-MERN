import React, { useContext, useEffect, useRef, useState } from "react";
import uniqid from "uniqid";
import Quill from "quill";
import { assets } from "../../assets/assets";
import { AppContext } from "../../context/AppContext";
import { toast } from "react-toastify";
import axios from "axios";

// shadcn/ui
import { Card, CardContent } from "../../components/ui/card";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { Separator } from "../../components/ui/separator";
import { Checkbox } from "../../components/ui/checkbox";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "../../components/ui/dialog";

const AddCourse = () => {
  const { backendUrl, getToken } = useContext(AppContext);

  const quillRef = useRef(null);
  const editorRef = useRef(null);

  const [courseTitle, setCourseTitle] = useState("");
  const [coursePrice, setCoursePrice] = useState(null);
  const [discount, setDiscount] = useState(null);
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

  // Quill init
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
        setChapters((prev) => [...prev, newChapter]);
      }
    } else if (action === "remove" && chapterId) {
      setChapters((prev) => prev.filter((ch) => ch.chapterId !== chapterId));
    } else if (action === "toggle" && chapterId) {
      setChapters((prev) =>
        prev.map((ch) =>
          ch.chapterId === chapterId ? { ...ch, collapsed: !ch.collapsed } : ch
        )
      );
    }
  };

  const handleLecture = (action, chapterId, lectureIndex) => {
    if (action === "add") {
      setCurrentChapterId(chapterId);
      setShowPopup(true);
    } else if (action === "remove" && typeof lectureIndex === "number") {
      setChapters((prev) =>
        prev.map((chapter) => {
          if (chapter.chapterId === chapterId) {
            const updated = [...chapter.chapterContent];
            updated.splice(lectureIndex, 1);
            return { ...chapter, chapterContent: updated };
          }
          return chapter;
        })
      );
    }
  };

  const addLecture = () => {
    if (!currentChapterId) return;
    setChapters((prev) =>
      prev.map((chapter) => {
        if (chapter.chapterId === currentChapterId) {
          const newLecture = {
            ...lectureDetails,
            lectureOrder:
              chapter.chapterContent.length > 0
                ? chapter.chapterContent.slice(-1)[0].lectureOrder + 1
                : 1,
            lectureId: uniqid(),
          };
          return {
            ...chapter,
            chapterContent: [...chapter.chapterContent, newLecture],
          };
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
      courseDescription: quillRef.current?.root?.innerHTML || "",
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
        if (quillRef.current) quillRef.current.root.innerHTML = "";
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  return (
    <div className="bg-white min-h-screen p-6 md:p-8">
      <form onSubmit={handleSubmit} className="max-w-4xl w-full space-y-8">
        {/* Header simples */}
        <div>
          <h1 className="text-2xl font-semibold text-[#213448]">
            Adicionar Curso
          </h1>
          <p className="text-sm text-black/60">
            Preenche os campos abaixo e publica o teu curso.
          </p>
        </div>

        {/* Card: Infos básicas */}
        <Card className="border border-[#ecefca]">
          <CardContent className="p-6 space-y-6">
            <div className="space-y-2">
              <label className="text-sm font-medium text-[#213448]">
                Título do Curso
              </label>
              <Input
                type="text"
                value={courseTitle}
                onChange={(e) => setCourseTitle(e.target.value)}
                placeholder="Escreve aqui"
                required
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-[#213448]">
                Descrição do Curso
              </label>
              <div
                ref={editorRef}
                className="bg-white border border-[#e5e7eb] rounded-md p-3 min-h-[180px]"
              />
            </div>

            <div className="flex flex-wrap gap-6">
              <div className="space-y-2">
                <label className="text-sm font-medium text-[#213448]">
                  Preço (€)
                </label>
                <Input
                  type="number"
                  value={coursePrice}
                  onChange={(e) => setCoursePrice(Number(e.target.value))}
                  placeholder="0"
                  required
                  className="w-36"
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-[#213448]">
                  Desconto %
                </label>
                <Input
                  type="number"
                  value={discount}
                  onChange={(e) => setDiscount(Number(e.target.value))}
                  min={0}
                  max={100}
                  placeholder="0"
                  className="w-36"
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-[#213448]">
                  Miniatura
                </label>
                <div className="flex items-center gap-3">
                  <label
                    htmlFor="thumbnailImage"
                    className="inline-flex items-center gap-2 rounded-md border border-[#d3dad9] px-3 py-2 text-sm hover:bg-[#f7f7f7] cursor-pointer"
                  >
                    <img src={assets.file_upload_icon} className="w-5 h-5" />
                    <span>Upload</span>
                  </label>
                  <Input
                    id="thumbnailImage"
                    type="file"
                    accept="image/*"
                    onChange={(e) => setImage(e.target.files?.[0] ?? null)}
                    className="hidden"
                  />
                  {image && (
                    <img
                      src={URL.createObjectURL(image)}
                      className="h-10 rounded border border-[#e5e7eb]"
                    />
                  )}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Card: Módulos e Aulas */}
        <Card className="border border-[#ecefca]">
          <CardContent className="p-6 space-y-4">
            <h2 className="text-lg font-semibold text-[#213448]">
              Módulos e Aulas
            </h2>
            <Separator className="bg-[#e5e7eb]" />

            <div className="space-y-4">
              {chapters.map((chapter, chapterIndex) => (
                <Card
                  key={chapter.chapterId}
                  className="border border-[#dfe7c0]"
                >
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() =>
                            handleChapter("toggle", chapter.chapterId)
                          }
                          className={`w-6 h-6 rounded-full border border-[#94b4c1] text-[#213448] text-xs grid place-items-center transition
                            ${chapter.collapsed ? "" : "rotate-180"}`}
                          title="Expandir/recolher"
                        >
                          ▾
                        </button>
                        <h3 className="font-semibold text-[#213448]">
                          {chapterIndex + 1}. {chapter.chapterTitle}
                        </h3>
                      </div>

                      <div className="flex items-center gap-3">
                        <span className="text-xs rounded-md border border-[#d3dad9] px-2 py-1">
                          {chapter.chapterContent.length} Aulas
                        </span>
                        <Button
                          type="button"
                          variant="outline"
                          className="border-[#ef4444] text-[#ef4444] hover:bg-red-50"
                          onClick={() =>
                            handleChapter("remove", chapter.chapterId)
                          }
                        >
                          Remover
                        </Button>
                      </div>
                    </div>

                    {!chapter.collapsed && (
                      <div className="mt-4 space-y-2">
                        {chapter.chapterContent.map((lecture, index) => (
                          <div
                            key={lecture.lectureId}
                            className="flex items-center justify-between border border-[#e5e7eb] rounded-md px-3 py-2"
                          >
                            <p className="text-sm text-black/80">
                              {index + 1}. {lecture.lectureTitle} —{" "}
                              {lecture.lectureDuration} min —{" "}
                              <a
                                href={lecture.lectureUrl}
                                target="_blank"
                                rel="noreferrer"
                                className="underline text-[#547792]"
                              >
                                Link
                              </a>{" "}
                              —{" "}
                              {lecture.isPreviewFree
                                ? "Prévia gratuita"
                                : "Pago"}
                            </p>
                            <Button
                              type="button"
                              size="icon"
                              variant="outline"
                              className="h-7 w-7 border-[#ef4444] text-[#ef4444] hover:bg-red-50"
                              onClick={() =>
                                handleLecture(
                                  "remove",
                                  chapter.chapterId,
                                  index
                                )
                              }
                              title="Remover aula"
                            >
                              ✕
                            </Button>
                          </div>
                        ))}

                        <Button
                          type="button"
                          variant="outline"
                          className="mt-2 border-[#94b4c1] text-[#213448] hover:bg-[#f3f7f9]"
                          onClick={() =>
                            handleLecture("add", chapter.chapterId)
                          }
                        >
                          + Adicionar Aula
                        </Button>
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))}

              <Button
                type="button"
                variant="outline"
                className="w-full border-[#94b4c1] text-[#213448] hover:bg-[#f3f7f9]"
                onClick={() => handleChapter("add")}
              >
                + Adicionar Módulo
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Publicar */}
        <div className="flex justify-end">
          <Button
            type="submit"
            className="bg-[#94b4c1] hover:bg-[#7ea3b0] text-white"
          >
            Publicar Curso
          </Button>
        </div>
      </form>

      {/* Dialog: Nova aula */}
      <Dialog open={showPopup} onOpenChange={setShowPopup}>
        <DialogContent className="sm:max-w-[420px]">
          <DialogHeader>
            <DialogTitle>Nova Aula</DialogTitle>
          </DialogHeader>

          <div className="space-y-3 pt-2">
            <Input
              placeholder="Título"
              value={lectureDetails.lectureTitle}
              onChange={(e) =>
                setLectureDetails({
                  ...lectureDetails,
                  lectureTitle: e.target.value,
                })
              }
            />
            <Input
              type="number"
              placeholder="Duração (min)"
              value={lectureDetails.lectureDuration}
              onChange={(e) =>
                setLectureDetails({
                  ...lectureDetails,
                  lectureDuration: e.target.value,
                })
              }
            />
            <Input
              placeholder="URL"
              value={lectureDetails.lectureUrl}
              onChange={(e) =>
                setLectureDetails({
                  ...lectureDetails,
                  lectureUrl: e.target.value,
                })
              }
            />

            <label className="flex items-center gap-2 text-sm">
              <Checkbox
                checked={lectureDetails.isPreviewFree}
                onCheckedChange={(val) =>
                  setLectureDetails({
                    ...lectureDetails,
                    isPreviewFree: Boolean(val),
                  })
                }
              />
              Pré-visualização gratuita?
            </label>
          </div>

          <DialogFooter className="pt-4">
            <Button
              className="w-full bg-[#94b4c1] hover:bg-[#7ea3b0]"
              onClick={addLecture}
            >
              Adicionar Aula
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AddCourse;
