import React from "react";
import { Button } from "@/components/ui/button"; // ajusta se não usas alias "@"
import { useNavigate } from "react-router-dom";
import SearchBar from "../student/SearchBar";
import { assets } from "../../assets/assets";

export const HeroSection = () => {
  const navigate = useNavigate();

  return (
    <section className="w-full">
      <div className="mx-auto w-full flex flex-col">
        {/* ====== BLOCO 1: Banner com imagem + título + CTA ====== */}
        <div className="relative overflow-hidden mt-10 mb-20 w-full px-8 flex-col justify-between ">
          {/* Imagem */}
          <img
            src={assets.hero}
            alt="Estudante a aprender no portátil"
            className="h-[700px]  px-10  object-fill justify-center items-center"
          />
          {/* Texto sobreposto */}
          <div className="absolute inset-0 flex items-center left-20">
            <div className="px-6 sm:px-10 ml-16">
              <h2 className="max-w-2xl text-8xl sm:text-3xl md:text-5xl font-semibold text-[#44444E] drop-shadow-[0_1px_0_rgba(255,255,255,0.85)]">
                Bem-vindo à tua plataforma
                <br className="hidden sm:block" />
                de aprendizagem digital.
              </h2>

              <div className="mt-4">
                <Button
                  className="bg-[#547792] hover:bg-[#547792]/90 text-[#ecefca] border border-[#d3dad9] rounded-[6px] px-10 py-2 text-sm"
                  onClick={() => navigate("/course-list")}
                >
                  Começar agora
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* ====== BLOCO 2: Painel azul com headline + subcopy + SearchBar ====== */}
        <div className="mt-10 w-full mx-auto   bg-[#547792] text-white shadow-sm px-6 py-10 md:py-20 text-center ">
          <h3 className="mx-auto max-w-3xl text-3xl md:text-4xl font-semibold leading-tight">
            Potencia o teu futuro com cursos
            <br className="hidden md:block" />
            desenhados para se adaptarem
            <br className="hidden md:block" />
            às tuas escolhas.
          </h3>

          <p className="mt-4 mx-auto max-w-2xl text-xs md:text-base text-white/85">
            Reunimos instrutores de classe mundial, conteúdo interativo e uma
            comunidade <br /> de apoio para te ajudar a alcançar os teus
            objetivos pessoais e profissionais.
          </p>

          {/* O teu SearchBar antigo aqui */}
          <div className="mt-6 mx-auto max-w-max  justify-center items-center">
            <SearchBar />
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
