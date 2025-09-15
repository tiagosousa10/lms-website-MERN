// components/community/TestimonialForm.jsx
import { useContext, useState } from "react";
import { useUser } from "@clerk/clerk-react";
import { AppContext } from "../../context/AppContext";
import { toast } from "react-toastify";
import { assets } from "../../assets/assets"; // <-- garante que tens assets.developerActivityBro

export default function TestimonialForm() {
  const { isSignedIn } = useUser();
  const { createTestimonial } = useContext(AppContext);

  const [form, setForm] = useState({ rating: 5, text: "" });
  const [submitting, setSubmitting] = useState(false);

  if (!isSignedIn) {
    return (
      <p className="text-sm opacity-75">
        Inicia sessão para deixar um testemunho.
      </p>
    );
  }

  const handleChange = (e) =>
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setSubmitting(true);
      await createTestimonial({
        rating: Number(form.rating),
        text: form.text.trim(),
      });
      setForm({ rating: 5, text: "" });
    } catch (error) {
      console.log("Error in createTestimonial:", error.message);
      toast.error(error.message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <section className="bg-[#213448] rounded-xl shadow p-4 md:p-6 text-white ">
      <div className="grid md:grid-cols-2 gap-8 items-stretch">
        {/* Coluna esquerda: Form */}
        <form onSubmit={handleSubmit} className="space-y-4 max-w-xl">
          <div>
            <h3 className="text-2xl font-semibold">
              Partilha o teu testemunho
            </h3>
            <p className="text-sm text-base-content/70">
              A tua opinião ajuda outros alunos a decidir.
            </p>
          </div>

          <label className="form-control">
            <span className="label-text">Avaliação (1–5)</span>
            <input
              name="rating"
              type="number"
              min={1}
              max={5}
              value={form.rating}
              onChange={handleChange}
              className="input input-bordered w-32 bg-white text-black"
              required
            />
          </label>

          <label className="form-control">
            <span className="label-text">Testemunho</span>
            <textarea
              name="text"
              value={form.text}
              onChange={handleChange}
              className="textarea textarea-bordered w-full min-h-32 bg-white text-black"
              placeholder="Escreve o teu testemunho (mín. 10 caracteres)"
              required
            />
          </label>

          <button
            className={`btn btn-neutral bg-[#547792] text-white  ${
              submitting ? "btn-disabled" : ""
            }`}
          >
            {submitting ? "A enviar…" : "Submeter"}
          </button>
        </form>

        {/* Coluna direita: Ilustração */}
        <aside className="relative">
          <div className="h-full w-full rounded-xl border border-base-300 bg-gradient-to-br from-base-200 to-base-100 p-4 md:p-6 flex items-center justify-center">
            <img
              src={assets.developerActivityBro}
              alt="Ilustração de atividade de desenvolvimento — Storyset"
              loading="lazy"
              className="max-h-[360px] md:max-h-[420px] w-full object-contain object-center"
            />
          </div>
        </aside>
      </div>
    </section>
  );
}
