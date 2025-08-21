import React from "react";
import logo from "/logo.jpg";

const Footer = () => {
  return (
    <footer className="bg-gray-900 md:px-36 text-left w-full mt-10">
      <div className="flex flex-col md:flex-row items-start px-8 md:px-0 justify-center gap-10 md:gap-32 py-10 border-b border-white/30">
        <div className="flex flex-row md:items-start items-center w-full gap-8">
          <img
            src={logo}
            alt="logótipo"
            className="w-20 h-20 rounded-full  object-cover mt-4  "
          />
          <p className="mt-6 text-center md:text-left text-sm text-white/80">
            A nossa plataforma é dedicada a fornecer educação de qualidade a
            qualquer pessoa, em qualquer lugar. Estamos comprometidos com o teu
            sucesso desde o primeiro clique.
          </p>
        </div>

        <div className="flex flex-col md:items-start items-center w-full">
          <h2 className="font-semibold text-white mb-5">Empresa</h2>
          <ul className="flex md:flex-col w-full justify-between text-sm text-white/80 md:space-y-2">
            <li>
              <a href="/about-us">Sobre nós</a>
            </li>
            <li>
              <a href="/contact-us">Contactos</a>
            </li>
            <li>
              <a href="/privacy-policy">Política de Privacidade</a>
            </li>
            <li>
              <a href="/faq">FAQs</a>
            </li>
          </ul>
        </div>

        <div className="hidden md:flex flex-col items-start w-full">
          <h2 className="font-semibold text-white mb-5">
            Subscreve a nossa newsletter
          </h2>
          <p className="text-sm text-white/80">
            As últimas novidades, artigos e recursos, diretamente no teu e-mail
            todas as semanas.
          </p>
          <div className="flex items-center gap-2 mt-4">
            <input
              type="email"
              placeholder="Insere o teu e-mail"
              className="border border-gray-500/30 bg-gray-800 text-gray-500 placeholder-gray-500 outline-none w-64 h-9 rounded px-2 text-sm"
            />
            <button className="bg-blue-600 w-24 h-9 text-white rounded">
              Subscrever
            </button>
          </div>
        </div>
      </div>
      <p className="py-4 text-center text-xs md:text-sm text-white/60">
        Copyright 2025 © Tiago Sousa. Todos os direitos reservados.
      </p>
    </footer>
  );
};

export default Footer;
