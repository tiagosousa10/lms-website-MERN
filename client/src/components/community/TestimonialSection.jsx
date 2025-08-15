import React, { useContext, useEffect } from "react";
import { AppContext } from "../../context/AppContext";
import { assets } from "../../assets/assets";

export default function TestimonialsSection() {
  const { randomTestimonials, fetchRandomTestimonials } =
    useContext(AppContext);

  useEffect(() => {
    if (!randomTestimonials?.length) {
      fetchRandomTestimonials();
    }
  }, []);

  return (
    <section className="pb-14 px-8 md:px-0">
      <div className="flex items-end justify-between">
        <h2 className="text-3xl font-medium text-gray-800">Testemunhos</h2>
        <button onClick={fetchRandomTestimonials} className="btn btn-sm">
          Mostrar outros
        </button>
      </div>
      <p className="md:text-base text-gray-500 mt-3">
        Ouve os nossos alunos enquanto partilham as suas jornadas de
        transformação, sucesso e como a nossa plataforma fez a diferença nas
        suas vidas.
      </p>

      <div className="grid grid-cols-auto gap-8 mt-14">
        {randomTestimonials?.map((testimonial, index) => (
          <div
            key={testimonial._id}
            className="text-sm text-left border border-gray-500/30 rounded-lg pb-6 bg-white shadow-[0px_4px_15px_0px] shadow-black/5 overflow-hidden"
          >
            <div className="flex items-center gap-4 px-5 py-4 bg-gray-500/10">
              {/* Avatar do usuário que fez o testemunho */}
              {testimonial.user?.imageUrl ? (
                <img
                  className="h-12 w-12 rounded-full"
                  src={testimonial.user.imageUrl}
                  alt={testimonial.user.name}
                />
              ) : (
                <div className="h-12 w-12 rounded-full bg-gray-300 flex items-center justify-center">
                  <span className="text-white">
                    {testimonial.user.name
                      .split(" ")
                      .map((n) => n[0])
                      .join("")}
                  </span>
                </div>
              )}
              <div>
                <h1 className="text-lg font-medium text-gray-800">
                  {testimonial.user.name}
                </h1>
                <p className="text-gray-800/80">{testimonial.user.email}</p>
              </div>
            </div>

            <div className="p-5 pb-7">
              <div className="flex gap-0.5">
                {[...Array(5)].map((_, i) => (
                  <img
                    key={i}
                    className="h-5"
                    src={
                      i < testimonial.rating ? assets.star : assets.star_blank
                    }
                    alt="estrela"
                  />
                ))}
              </div>
              <p className="text-gray-500 mt-5">{testimonial.text}</p>
            </div>

            <a href="#" className="text-blue-500 underline px-5">
              Ler mais
            </a>
          </div>
        ))}
      </div>
    </section>
  );
}
