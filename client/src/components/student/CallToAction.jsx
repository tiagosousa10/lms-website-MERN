import React from "react";
import { assets } from "../../assets/assets";

const CallToAction = () => {
  return (
    <div className="flex flex-col items-center gap-4 pt-10 pb-24 px-8 md:px-0">
      <h1 className="text-xl md:text-4xl text-gray-800 font-semibold">
        Aprende qualquer coisa, a qualquer hora, em qualquer lugar
      </h1>
      <p className="text-gray-500 sm:text-sm">
        Aprende ao teu ritmo, com conteúdos criados por especialistas e
        disponíveis sempre que precisares.
      </p>

      <div className="flex items-center font-medium gap-6 mt-4">
        <button className="px-10 py-3 rounded-md text-white bg-blue-600">
          Começar Agora
        </button>
        <button className="flex items-center gap-2">
          Saber Mais <img src={assets.arrow_icon} alt="ícone de seta" />
        </button>
      </div>
    </div>
  );
};

export default CallToAction;
