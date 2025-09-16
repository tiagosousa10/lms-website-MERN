import React from "react";
import { assets } from "../../assets/assets";

const CallToAction = () => {
  return (
    <section className="w-full">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-20">
        <h2 className="text-2xl md:text-4xl text-gray-800 font-semibold text-center">
          Aprende qualquer coisa, a qualquer hora, em qualquer lugar
        </h2>
        <p className="text-gray-500 text-sm md:text-base text-center mt-3 max-w-2xl mx-auto">
          Aprende ao teu ritmo, com conteúdos criados por especialistas e
          disponíveis sempre que precisares.
        </p>

        <div className="mt-6 md:mt-8 flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-6">
          <button className="w-full sm:w-auto px-8 py-3 rounded-md text-white bg-[#547792]">
            Começar Agora
          </button>
          <button className="w-full sm:w-auto flex items-center justify-center gap-2 border border-[#213448] py-3 px-8 rounded-md">
            Saber Mais <img src={assets.arrow_icon} alt="ícone de seta" />
          </button>
        </div>
      </div>
    </section>
  );
};

export default CallToAction;
