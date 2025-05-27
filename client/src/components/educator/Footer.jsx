import React from "react";
import { assets } from "../../assets/assets";

const Footer = () => {
  return (
    <footer className="flex md:flex-row flex-col-reverse items-center justify-between text-left w-full px-8 border-t">
      <div className="flex items-center gap-4">
        <img
          className="hidden md:block w-20"
          src={assets.logo}
          alt="logótipo"
        />
        <div className="hidden md:block h-7 w-px bg-gray-500/60"></div>
        <p className="py-4 text-center text-xs md:text-sm text-gray-500">
          Copyright 2025 © Tiago Sousa. Todos os direitos reservados.
        </p>
      </div>
      <div className="flex items-center gap-3 max-md:mt-4">
        <a href="#" aria-label="Facebook">
          <img src={assets.facebook_icon} alt="ícone Facebook" />
        </a>
        <a href="#" aria-label="Twitter">
          <img src={assets.twitter_icon} alt="ícone Twitter" />
        </a>
        <a href="#" aria-label="Instagram">
          <img src={assets.instagram_icon} alt="ícone Instagram" />
        </a>
      </div>
    </footer>
  );
};

export default Footer;
