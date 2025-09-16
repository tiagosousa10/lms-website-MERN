import React from "react";
import { Button } from "@/components/ui/button"; // ajusta se não usas alias "@"
import { useNavigate } from "react-router-dom";
import SearchBar from "../student/SearchBar";
import { assets } from "../../assets/assets";

export default function Hero() {
  const navigate = useNavigate();

  return (
    <section className="w-full">
      {/* Bloco 1 — Hero */}
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center">
          {/* Imagem */}
          <div className="w-full">
            <div className="w-full rounded-xl overflow-hidden shadow-sm">
              <img
                src={assets.hero}
                alt="Estudante a aprender no portátil"
                className="w-full h-64 xs:h-80 md:h-[28rem] object-cover"
                loading="eager"
                decoding="async"
              />
            </div>
          </div>

          {/* Texto + CTA */}
          <div className="text-left lg:text-left">
            <h1 className="text-3xl xs:text-4xl md:text-5xl lg:text-6xl font-semibold leading-tight text-[#44444E]">
              Bem-vindo à tua plataforma de aprendizagem digital.
            </h1>

            <p className="mt-4 text-sm md:text-base text-[#566] max-w-prose">
              Cursos práticos, conteúdos interativos e comunidade de apoio para
              acelerares o teu percurso.
            </p>

            <div className="mt-6 flex flex-col sm:flex-row gap-3 sm:gap-4">
              <Button
                className="bg-[#547792] hover:bg-[#547792]/90 text-[#ecefca] border border-[#d3dad9] rounded-md px-6 py-3 text-sm md:text-base mx-auto"
                onClick={() => navigate("/course-list")}
              >
                Começar agora
              </Button>

              <div className="w-full sm:w-auto hidden">
                <SearchBar />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bloco 2 — Painel informativo com Search (mantido, mas responsivo) */}
      <div className="w-full bg-[#547792] text-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-10 md:py-16 text-center">
          <h3 className="mx-auto max-w-3xl text-2xl md:text-4xl font-semibold leading-tight">
            Potencia o teu futuro com cursos desenhados para se adaptarem às
            tuas escolhas.
          </h3>

          <p className="mt-3 mx-auto max-w-2xl text-xs md:text-base text-white/85">
            Instrutores de classe mundial, conteúdo interativo e comunidade de
            apoio — tudo num só lugar.
          </p>

          <div className="mt-6 mx-auto max-w-xl">
            <SearchBar />
          </div>
        </div>
      </div>
    </section>
  );
}
