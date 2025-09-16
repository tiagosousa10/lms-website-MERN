import React, { useContext, useEffect } from "react";
import { AppContext } from "../../context/AppContext";
import { assets } from "../../assets/assets";

const initialsFromName = (name = "") =>
  name
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((n) => n[0]?.toUpperCase() || "")
    .join("");

const TestimonialsSection = () => {
  const { randomTestimonials, fetchRandomTestimonials } =
    useContext(AppContext);

  useEffect(() => {
    if (!randomTestimonials?.length) fetchRandomTestimonials();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <section className="w-full bg-[#547792]">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">
        <header className="text-left md:text-center">
          <h2 className="text-2xl md:text-4xl font-semibold text-white">
            Testemunhos
          </h2>
          <p className="text-xs md:text-base text-[#D3DAD9] mt-3 max-w-3xl md:mx-auto">
            Ouve os nossos alunos e como a plataforma fez a diferença nas suas
            vidas.
          </p>
        </header>

        <div className="mt-10 md:mt-14 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {(randomTestimonials?.length
            ? randomTestimonials
            : Array(4).fill(null)
          ).map((testimonial, index) => (
            <article
              key={testimonial?._id || index}
              className="text-sm text-left border border-white/20 rounded-lg bg-white shadow-sm overflow-hidden"
            >
              <div className="flex items-center gap-4 px-5 py-4 bg-[#94B4C1]">
                <div className="avatar placeholder">
                  <div className="bg-neutral text-neutral-content rounded-full w-12 h-12 grid place-items-center">
                    <span className="text-base text-[#D3DAD9]">
                      {testimonial
                        ? initialsFromName(testimonial?.user?.name)
                        : "—"}
                    </span>
                  </div>
                </div>

                <div>
                  <h3 className="text-base font-medium text-[#D3DAD9]">
                    {testimonial?.user?.name || "Utilizador"}
                  </h3>
                  <p className="text-gray-800/80 text-xs">
                    {testimonial?.user?.email || "Aluno"}
                  </p>
                </div>
              </div>

              <div className="p-5">
                <p className="text-gray-600 mb-4">
                  {testimonial?.text || "Carregar testemunhos…"}
                </p>
                <div className="flex gap-0.5" aria-label="Avaliação">
                  {[...Array(5)].map((_, i) => (
                    <img
                      className="h-5"
                      key={i}
                      src={
                        i < Math.floor(testimonial?.rating || 0)
                          ? assets.star
                          : assets.star_blank
                      }
                      alt={
                        i < Math.floor(testimonial?.rating || 0)
                          ? "estrela preenchida"
                          : "estrela vazia"
                      }
                    />
                  ))}
                </div>
              </div>

              <div className="px-5 pb-4">
                <a href="#" className="text-[#715A5A] underline text-sm">
                  Ler mais
                </a>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TestimonialsSection;
