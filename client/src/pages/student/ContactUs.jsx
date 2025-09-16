import React from "react";
import {
  MapPin,
  Mail,
  Phone,
  Instagram,
  Github,
  Linkedin,
  Youtube,
} from "lucide-react";
import { assets } from "../../assets/assets";

const ContactUs = () => {
  return (
    <main className="bg-white min-h-screen w-full">
      <section className="container mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">
        <header className="text-center md:text-left mb-8">
          <h1 className="text-3xl md:text-4xl font-bold mb-3">Fale Connosco</h1>
          <p className="text-black/70">
            Estamos aqui para te ajudar! Envia-nos uma mensagem ou utiliza os
            contactos diretos abaixo.
          </p>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-start">
          {/* info + cartão de contacto */}
          <div className="space-y-6">
            <div className="rounded-md border border-slate-200 p-5 sm:p-6">
              <h2 className="text-lg font-semibold mb-3">Entra em Contacto</h2>
              <ul className="space-y-3 text-slate-700">
                <li className="flex items-center gap-2">
                  <Mail className="w-5 h-5" />
                  <a
                    className="underline break-all"
                    href="mailto:tiagosousa.tams@hotmail.com"
                  >
                    tiagosousa.tams@hotmail.com
                  </a>
                </li>
                <li className="flex items-center gap-2">
                  <Phone className="w-5 h-5" />
                  <a className="underline" href="tel:+351000000000">
                    +351 000 000 000
                  </a>
                </li>
                <li className="flex items-center gap-2">
                  <MapPin className="w-5 h-5" />
                  <span>Portugal</span>
                </li>
              </ul>
            </div>

            {/* ícones sociais (tamanho de toque ≥44px) */}
            <div className="flex gap-3">
              <a
                href="https://github.com/"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="GitHub"
                className="inline-flex items-center justify-center w-11 h-11 rounded-md border border-slate-200 hover:bg-slate-50"
              >
                <Github className="w-5 h-5" />
              </a>
              <a
                href="https://www.linkedin.com/"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="LinkedIn"
                className="inline-flex items-center justify-center w-11 h-11 rounded-md border border-slate-200 hover:bg-slate-50"
              >
                <Linkedin className="w-5 h-5" />
              </a>
              <a
                href="https://www.instagram.com/"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Instagram"
                className="inline-flex items-center justify-center w-11 h-11 rounded-md border border-slate-200 hover:bg-slate-50"
              >
                <Instagram className="w-5 h-5" />
              </a>
              <a
                href="https://www.youtube.com/"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="YouTube"
                className="inline-flex items-center justify-center w-11 h-11 rounded-md border border-slate-200 hover:bg-slate-50"
              >
                <Youtube className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* imagem */}
          <div className="max-w-xl mx-auto lg:max-w-none">
            <img
              src={assets.contact_us}
              alt="Ilustração de contacto"
              className="w-full h-64 sm:h-80 md:h-[28rem] object-contain"
              loading="lazy"
              decoding="async"
            />
          </div>
        </div>
      </section>
    </main>
  );
};

export default ContactUs;
