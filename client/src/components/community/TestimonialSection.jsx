import React, { useContext, useEffect, useState } from "react";
import { AppContext } from "../../context/AppContext";
import { assets } from "../../assets/assets";

const initials = (name = "") =>
  name
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((n) => n[0]?.toUpperCase() || "")
    .join("");

export default function TestimonialsSection() {
  const { randomTestimonials, fetchRandomTestimonials } =
    useContext(AppContext);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!randomTestimonials?.length) fetchRandomTestimonials();
  }, []);

  const refresh = async () => {
    setLoading(true);
    await fetchRandomTestimonials();
    setLoading(false);
  };

  return (
    <section className="py-10">
      {/* header */}
      <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-3">
        <h2 className="text-3xl font-bold text-gray-800">Testemunhos</h2>
        <button
          onClick={refresh}
          className="inline-flex h-11 items-center rounded-md bg-[#ECEFCA] px-4 text-[#547792] hover:bg-[#547792] hover:text-[#ECEFCA] transition"
          aria-live="polite"
        >
          {loading ? "A carregar…" : "Mostrar outros"}
        </button>
      </div>

      <p className="text-gray-500 mt-3">
        Ouve os nossos alunos enquanto partilham as suas jornadas de
        transformação, sucesso e como a nossa plataforma fez a diferença nas
        suas vidas.
      </p>

      {/* grid responsiva */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mt-10">
        {randomTestimonials?.map((t) => (
          <article
            key={t._id}
            className="text-sm text-left border border-gray-200 rounded-lg bg-white shadow-sm overflow-hidden"
          >
            {/* header do card */}
            <header className="flex items-center gap-4 px-5 py-4 bg-[#94B4C1]">
              {t.user?.imageUrl ? (
                <img
                  className="h-12 w-12 rounded-full object-cover"
                  src={t.user.imageUrl}
                  alt={`Foto de ${t.user.name}`}
                  loading="lazy"
                />
              ) : (
                <div
                  className="h-12 w-12 rounded-full bg-[#547792] grid place-items-center text-white"
                  aria-hidden="true"
                  title={t.user?.name}
                >
                  {initials(t.user?.name)}
                </div>
              )}
              <div className="min-w-0">
                <h3 className="text-base font-semibold text-white truncate">
                  {t.user?.name}
                </h3>
                <p className="text-gray-900/80 truncate">{t.user?.email}</p>
              </div>
            </header>

            {/* corpo */}
            <div className="p-5">
              <div
                className="flex gap-0.5"
                aria-label={`Avaliação: ${t.rating} de 5`}
              >
                {[...Array(5)].map((_, i) => (
                  <img
                    key={i}
                    className="h-5"
                    src={i < t.rating ? assets.star : assets.star_blank}
                    alt=""
                    aria-hidden="true"
                  />
                ))}
              </div>
              <p className="text-gray-600 mt-4 line-clamp-4 md:line-clamp-5">
                {t.text}
              </p>
            </div>

            <footer className="px-5 pb-5">
              <a
                href="#"
                className="text-blue-600 underline underline-offset-2"
                onClick={(e) => e.preventDefault()}
              >
                Ler mais
              </a>
            </footer>
          </article>
        ))}
      </div>
    </section>
  );
}
