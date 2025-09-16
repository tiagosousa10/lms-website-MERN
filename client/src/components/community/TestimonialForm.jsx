import { useContext, useState } from "react";
import { useUser } from "@clerk/clerk-react";
import { AppContext } from "../../context/AppContext";
import { toast } from "react-toastify";
import { assets } from "../../assets/assets";

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
    if ((form.text || "").trim().length < 10) {
      return toast.error("Escreve pelo menos 10 caracteres.");
    }
    try {
      setSubmitting(true);
      await createTestimonial({
        rating: Number(form.rating),
        text: form.text.trim(),
      });
      setForm({ rating: 5, text: "" });
    } catch (error) {
      toast.error(error.message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <section className="bg-[#213448] rounded-xl shadow text-white p-6 md:p-8">
      <div className="grid md:grid-cols-2 gap-8 items-stretch">
        {/* form */}
        <form onSubmit={handleSubmit} className="space-y-4 max-w-xl" noValidate>
          <div>
            <h3 className="text-2xl font-semibold">
              Partilha o teu testemunho
            </h3>
            <p id="tf-help" className="text-sm text-white/70">
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
              inputMode="numeric"
              aria-describedby="tf-help"
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
              minLength={10}
              aria-describedby="tf-help"
            />
          </label>

          <button
            className="btn h-11 bg-[#547792] text-white hover:bg-[#547792]/90"
            disabled={submitting}
          >
            {submitting ? "A enviar…" : "Submeter"}
          </button>
        </form>

        {/* ilustração */}
        <aside className="relative">
          <div className="h-full w-full rounded-xl border border-white/10 bg-white/5 p-4 md:p-6 flex items-center justify-center">
            <img
              src={assets.developerActivityBro}
              alt="Ilustração de atividade — Storyset"
              loading="lazy"
              className="max-h-[360px] md:max-h-[420px] w-full object-contain"
            />
          </div>
        </aside>
      </div>
    </section>
  );
}
