import React, { useContext, useEffect, useRef, useState } from "react";
import uniqid from "uniqid";
import Quill from "quill";
import "quill/dist/quill.snow.css"; // garante tema Snow visível :contentReference[oaicite:1]{index=1}
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
import { CATEGORIES } from "../../constants/categories";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "../../components/ui/dialog";

const AddCourse = () => {
  const { backendUrl, getToken, uploadLectureVideo, secsToMins } =
    useContext(AppContext);

  const quillRef = useRef(null);
  const editorRef = useRef(null);

  const [courseTitle, setCourseTitle] = useState("");
  const [coursePrice, setCoursePrice] = useState("");
  const [discount, setDiscount] = useState("");
  const [category, setCategory] = useState("");
  const [image, setImage] = useState(null);
  const [chapters, setChapters] = useState([]);
  const [showPopup, setShowPopup] = useState(false);
  const [currentChapterId, setCurrentChapterId] = useState(null);

  const [lectureDetails, setLectureDetails] = useState({
    lectureTitle: "",
    lectureDuration: "",
    lectureUrl: "",
    isPreviewFree: false,
    lectureProvider: "youtube", // "youtube" | "cloudinary"
    cloudinaryPublicId: undefined,
  });

  const [videoFile, setVideoFile] = useState(null);
  const [isUploadingVideo, setIsUploadingVideo] = useState(false);

  // Quill init (Snow toolbar padrão)
  useEffect(() => {
    if (!quillRef.current && editorRef.current) {
      quillRef.current = new Quill(editorRef.current, {
        theme: "snow",
        modules: {
          toolbar: [
            ["bold", "italic", "underline", "strike"],
            [{ header: [1, 2, 3, false] }],
            [{ list: "ordered" }, { list: "bullet" }],
            ["link", "image", "video"],
            ["clean"],
          ],
        },
      });
    }
  }, []);

  const handleChapter = (action, chapterId) => {
    if (action === "add") {
      const title = window.prompt("Nome do Módulo:");
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
    if (!lectureDetails.lectureTitle?.trim())
      return toast.error("Título da aula é obrigatório");
    const dur = Number(lectureDetails.lectureDuration);
    if (!dur || dur <= 0) return toast.error("Define a duração (minutos)");
    if (
      lectureDetails.lectureProvider === "youtube" &&
      !lectureDetails.lectureUrl
    )
      return toast.error("Insere o URL do YouTube");
    if (
      lectureDetails.lectureProvider === "cloudinary" &&
      !lectureDetails.lectureUrl
    )
      return toast.error("Carrega o vídeo para gerar o URL");

    setChapters((prev) =>
      prev.map((chapter) => {
        if (chapter.chapterId === currentChapterId) {
          const newLecture = {
            ...lectureDetails,
            lectureDuration: dur,
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
      lectureProvider: "youtube",
      cloudinaryPublicId: undefined,
    });
    setVideoFile(null);
    setIsUploadingVideo(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!image) return toast.error("Imagem não selecionada");
    if (!category) return toast.error("Seleciona uma categoria");
    if (Number(discount) < 0 || Number(discount) > 100)
      return toast.error("Desconto deve estar entre 0 e 100");

    const courseData = {
      courseTitle,
      courseDescription: quillRef.current?.root?.innerHTML || "",
      coursePrice: Number(coursePrice),
      discount: Number(discount),
      category,
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
        toast.success(data.message || "Curso criado!");
        setCourseTitle("");
        setCoursePrice("");
        setDiscount("");
        setCategory("");
        setImage(null);
        setChapters([]);
        if (quillRef.current) quillRef.current.root.innerHTML = "";
      } else {
        toast.error(data.message || "Falha ao criar curso");
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  const canAddLecture =
    lectureDetails.lectureTitle?.trim() &&
    Number(lectureDetails.lectureDuration) > 0 &&
    !isUploadingVideo &&
    ((lectureDetails.lectureProvider === "youtube" &&
      !!lectureDetails.lectureUrl) ||
      (lectureDetails.lectureProvider === "cloudinary" &&
        !!lectureDetails.lectureUrl));

  return (
    <main className="bg-white min-h-screen">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-10">
        <form onSubmit={handleSubmit} className="max-w-5xl w-full space-y-8">
          <header>
            <h1 className="text-2xl md:text-3xl font-semibold text-[#213448]">
              Adicionar Curso
            </h1>
            <p className="text-sm text-black/60">
              Preenche os campos abaixo e publica o teu curso.
            </p>
          </header>

          {/* Infos básicas */}
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
                  className="h-11"
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-[#213448]">
                  Descrição do Curso
                </label>
                <div
                  ref={editorRef}
                  className="bg-white border border-[#e5e7eb] rounded-md min-h-[180px]"
                />
              </div>

              {/* linha: preço, desconto, categoria, miniatura */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-[#213448]">
                    Preço (€)
                  </label>
                  <Input
                    type="number"
                    value={coursePrice}
                    onChange={(e) => setCoursePrice(e.target.value)}
                    placeholder="0"
                    required
                    className="h-11"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-[#213448]">
                    Desconto %
                  </label>
                  <Input
                    type="number"
                    value={discount}
                    onChange={(e) => setDiscount(e.target.value)}
                    min={0}
                    max={100}
                    placeholder="0"
                    className="h-11"
                  />
                </div>

                <div className="space-y-2 flex flex-col">
                  <label className="text-sm font-medium text-[#213448]">
                    Categoria
                  </label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    required
                    className="rounded-md border border-gray-300 bg-white px-3 py-2 h-11 text-sm text-gray-700 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none shadow-sm"
                  >
                    <option value="" disabled>
                      Seleciona…
                    </option>
                    {CATEGORIES.map((c) => (
                      <option key={c} value={c}>
                        {c}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-[#213448]">
                    Imagem
                  </label>
                  <div className="flex items-center gap-3">
                    <label
                      htmlFor="thumbnailImage"
                      className="inline-flex items-center justify-center gap-2 rounded-md border border-[#d3dad9] px-3 py-2 h-11 text-sm hover:bg-[#f7f7f7] cursor-pointer"
                    >
                      <img
                        src={assets.file_upload_icon}
                        className="w-5 h-5"
                        alt=""
                      />
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
                        alt="Pré-visualização"
                      />
                    )}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Módulos e Aulas */}
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
                      <div className="flex flex-wrap items-center justify-between gap-3">
                        <div className="flex items-center gap-2">
                          <button
                            type="button"
                            onClick={() =>
                              handleChapter("toggle", chapter.chapterId)
                            }
                            className={`w-8 h-8 rounded-full border border-[#94b4c1] text-[#213448] text-sm grid place-items-center`}
                            title="Expandir/recolher"
                            aria-label="Expandir ou recolher módulo"
                          >
                            <span
                              className={`${
                                chapter.collapsed ? "" : "rotate-180"
                              } inline-block transition-transform`}
                            >
                              ▾
                            </span>
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
                            className="h-9 border-[#ef4444] text-[#ef4444] hover:bg-red-50"
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
                              className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border border-[#e5e7eb] rounded-md px-3 py-2"
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
                                  : "Pago"}{" "}
                                —{" "}
                                <span className="text-xs px-2 py-0.5 rounded border">
                                  {lecture.lectureProvider === "cloudinary"
                                    ? "Cloudinary"
                                    : "YouTube"}
                                </span>
                              </p>
                              <Button
                                type="button"
                                size="icon"
                                variant="outline"
                                className="h-8 w-8 border-[#ef4444] text-[#ef4444] hover:bg-red-50"
                                onClick={() =>
                                  handleLecture(
                                    "remove",
                                    chapter.chapterId,
                                    index
                                  )
                                }
                                title="Remover aula"
                                aria-label="Remover aula"
                              >
                                ✕
                              </Button>
                            </div>
                          ))}

                          <Button
                            type="button"
                            variant="outline"
                            className="mt-2 h-10 border-[#94b4c1] text-[#213448] hover:bg-[#f3f7f9]"
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
                  className="w-full h-11 border-[#94b4c1] text-[#213448] hover:bg-[#f3f7f9]"
                  onClick={() => handleChapter("add")}
                >
                  + Adicionar Módulo
                </Button>
              </div>
            </CardContent>
          </Card>

          <div className="flex justify-end">
            <Button
              type="submit"
              className="h-11 bg-[#94b4c1] hover:bg-[#7ea3b0] text-white"
            >
              Publicar Curso
            </Button>
          </div>
        </form>
      </div>

      {/* Dialog: Nova aula */}
      <Dialog
        open={showPopup}
        onOpenChange={(open) => {
          setShowPopup(open);
          if (!open) {
            setLectureDetails({
              lectureTitle: "",
              lectureDuration: "",
              lectureUrl: "",
              isPreviewFree: false,
              lectureProvider: "youtube",
              cloudinaryPublicId: undefined,
            });
            setVideoFile(null);
            setIsUploadingVideo(false);
            setCurrentChapterId(null);
          }
        }}
      >
        <DialogContent className="sm:max-w-[520px]">
          <DialogHeader>
            <DialogTitle>Nova Aula</DialogTitle>
          </DialogHeader>

          <div className="space-y-3 pt-2">
            <Input
              placeholder="Título"
              value={lectureDetails.lectureTitle}
              onChange={(e) =>
                setLectureDetails((s) => ({
                  ...s,
                  lectureTitle: e.target.value,
                }))
              }
              className="h-11"
            />

            {/* Origem do vídeo */}
            <fieldset className="space-y-1">
              <legend className="text-sm font-medium">Origem do vídeo</legend>
              <div className="flex gap-6">
                <label className="flex items-center gap-2 text-sm">
                  <input
                    type="radio"
                    name="provider"
                    value="youtube"
                    checked={lectureDetails.lectureProvider === "youtube"}
                    onChange={() =>
                      setLectureDetails((s) => ({
                        ...s,
                        lectureProvider: "youtube",
                        lectureUrl: "",
                        cloudinaryPublicId: undefined,
                      }))
                    }
                  />
                  YouTube (link)
                </label>
                <label className="flex items-center gap-2 text-sm">
                  <input
                    type="radio"
                    name="provider"
                    value="cloudinary"
                    checked={lectureDetails.lectureProvider === "cloudinary"}
                    onChange={() =>
                      setLectureDetails((s) => ({
                        ...s,
                        lectureProvider: "cloudinary",
                        lectureUrl: "",
                        cloudinaryPublicId: undefined,
                      }))
                    }
                  />
                  Cloudinary (ficheiro)
                </label>
              </div>
            </fieldset>

            {lectureDetails.lectureProvider === "youtube" ? (
              <Input
                placeholder="URL do YouTube (https://…)"
                value={lectureDetails.lectureUrl}
                onChange={(e) =>
                  setLectureDetails((s) => ({
                    ...s,
                    lectureUrl: e.target.value,
                  }))
                }
                className="h-11"
              />
            ) : (
              <div className="space-y-2">
                <Input
                  type="file"
                  accept="video/*"
                  onChange={(e) => setVideoFile(e.target.files?.[0] || null)}
                />
                <Button
                  type="button"
                  variant="outline"
                  disabled={!videoFile || isUploadingVideo}
                  onClick={async () => {
                    if (!videoFile) return;
                    try {
                      setIsUploadingVideo(true);
                      const up = await uploadLectureVideo({ file: videoFile });
                      // Cloudinary retorna secure_url/public_id/duration (seg) no upload. :contentReference[oaicite:2]{index=2}
                      if (up.ok) {
                        setLectureDetails((s) => ({
                          ...s,
                          lectureUrl: up.secure_url,
                          cloudinaryPublicId: up.public_id,
                          lectureDuration: secsToMins
                            ? secsToMins(up.duration)
                            : Math.max(1, Math.ceil((up.duration || 0) / 60)),
                        }));
                        toast.success("Vídeo carregado");
                      } else {
                        toast.error(up.error || "Falha no upload");
                      }
                    } finally {
                      setIsUploadingVideo(false);
                    }
                  }}
                  className="h-10"
                >
                  {isUploadingVideo ? "A carregar…" : "Carregar vídeo"}
                </Button>

                {lectureDetails.lectureUrl && (
                  <p className="text-xs text-gray-600 break-all">
                    URL:{" "}
                    <a
                      href={lectureDetails.lectureUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="underline"
                    >
                      {lectureDetails.lectureUrl}
                    </a>
                  </p>
                )}
              </div>
            )}

            <Input
              type="number"
              placeholder="Duração (min)"
              value={lectureDetails.lectureDuration}
              onChange={(e) =>
                setLectureDetails((s) => ({
                  ...s,
                  lectureDuration: e.target.value,
                }))
              }
              className="h-11"
              inputMode="numeric"
            />

            <label className="flex items-center gap-2 text-sm">
              <Checkbox
                checked={lectureDetails.isPreviewFree}
                onCheckedChange={(val) =>
                  setLectureDetails((s) => ({
                    ...s,
                    isPreviewFree: Boolean(val),
                  }))
                }
              />
              Pré-visualização gratuita?
            </label>
          </div>

          <DialogFooter className="pt-4">
            <Button
              className="w-full h-11 bg-[#94b4c1] hover:bg-[#7ea3b0]"
              disabled={!canAddLecture}
              onClick={() => {
                if (!canAddLecture) return;
                setLectureDetails((s) => ({
                  ...s,
                  lectureDuration: Number(s.lectureDuration),
                }));
                addLecture();
              }}
            >
              {isUploadingVideo ? "A aguardar upload…" : "Adicionar Aula"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </main>
  );
};

export default AddCourse;
