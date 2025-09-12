// components/community/TestimonialsSection.jsx
import React, { useContext, useEffect } from "react";
import { AppContext } from "../../context/AppContext";
import { assets } from "../../assets/assets";

// helpers to get initials from name
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
    // garante que há dados na primeira montagem (idempotente se já chamadas no contexto)
    if (!randomTestimonials?.length) fetchRandomTestimonials();
  }, []);

  return (
    <div className="py-14 px-8 md:px-8 bg-[#547792] w-[90%] rounded-md">
      <div className="flex justify-center items-center">
        <div className="flex justify-between gap-3">
          <div>
            <h2 className="text-4xl font-semibold text-white">Testemunhos</h2>
            <p className="md:text-base text-[#D3DAD9] mt-3">
              Ouve os nossos alunos enquanto partilham as suas jornadas de
              transformação, sucesso <br /> e como a nossa plataforma fez a
              diferença nas suas vidas.
            </p>
          </div>
        </div>
      </div>

      <div className="flex flex-wrap gap-8 mt-14 justify-center items-center">
        {(randomTestimonials?.length
          ? randomTestimonials
          : Array(4).fill(null)
        ).map((testimonial, index) => (
          <div
            key={testimonial?._id || index}
            className="text-sm text-left border border-gray-500/30 rounded-lg pb-6 bg-white shadow-[0px_4px_15px_0px] shadow-black/5 overflow-hidden"
          >
            <div className="flex items-center gap-4 px-5 py-4 bg-[#94B4C1] ">
              {/* Avatar: se não houver imagem, mostra iniciais */}
              <div className="avatar placeholder">
                <div className="bg-neutral text-neutral-content rounded-full w-12 h-12">
                  <span className="text-base text-[#D3DAD9]">
                    {testimonial
                      ? initialsFromName(testimonial?.user?.name)
                      : "—"}
                  </span>
                </div>
              </div>

              <div>
                <h1 className="text-lg font-medium text-[#D3DAD9]">
                  {testimonial?.user?.name || "Utilizador"}
                </h1>
                <p className="text-gray-800/80">
                  {testimonial?.user?.email || "Aluno"}
                </p>
              </div>
            </div>

            <div className="p-5 pb-7">
              <p className="text-gray-500 mb-5">
                {testimonial?.text || "Carregar testemunhos…"}
              </p>
              <div className="flex gap-0.5">
                {[...Array(5)].map((_, i) => (
                  <img
                    className="h-5"
                    key={i}
                    src={
                      i < Math.floor(testimonial?.rating || 0)
                        ? assets.star
                        : assets.star_blank
                    }
                    alt="estrela"
                  />
                ))}
              </div>
            </div>

            <a href="#" className="text-[#715A5A] underline px-5">
              Ler mais
            </a>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TestimonialsSection;
