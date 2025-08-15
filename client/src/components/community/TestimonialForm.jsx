// components/community/TestimonialForm.jsx
import { useContext, useState } from "react";
import { useUser } from "@clerk/clerk-react";
import { AppContext } from "../../context/AppContext";
import { toast } from "react-toastify";

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
    <form onSubmit={handleSubmit} className="space-y-4 max-w-xl">
      <label className="form-control">
        <span className="label-text">Avaliação (1–5)</span>
        <input
          name="rating"
          type="number"
          min={1}
          max={5}
          value={form.rating}
          onChange={handleChange}
          className="input input-bordered w-32"
          required
        />
      </label>

      <textarea
        name="text"
        value={form.text}
        onChange={handleChange}
        className="textarea textarea-bordered w-full min-h-28"
        placeholder="Escreve o teu testemunho (mín. 10 caracteres)"
        required
      />

      <button className={`btn btn-primary ${submitting ? "btn-disabled" : ""}`}>
        {submitting ? "A enviar…" : "Submeter"}
      </button>
    </form>
  );
}
