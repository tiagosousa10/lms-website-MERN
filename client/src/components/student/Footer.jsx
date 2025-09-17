import React from "react";
import { Link } from "react-router-dom";
import logo from "/logo.jpg";

const Footer = () => {
  return (
    <footer role="contentinfo" className="bg-[#213448] text-white w-full mt-10">
      <div className="mx-auto max-w-7xl px-6 md:px-10">
        {/* Top grid reduzido */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8 py-6 border-b border-white/20">
          {/* Brand + copy */}
          <div className="flex gap-3">
            <img
              src={logo}
              alt="tsAcademy"
              className="w-12 h-12 md:w-16 md:h-16 rounded-full object-cover flex-shrink-0"
              loading="lazy"
              decoding="async"
            />
            <p className="text-xs md:text-sm text-white/80 leading-tight">
              A nossa plataforma oferece educação de qualidade para todos, em
              qualquer lugar. Comprometidos com teu sucesso desde o primeiro
              clique.
            </p>
          </div>

          {/* Navegação do site */}
          <nav aria-label="Links da empresa" className="md:pl-4">
            <h2 className="font-semibold mb-3 md:mb-4 text-sm">Empresa</h2>
            <ul className="flex md:flex-col flex-wrap gap-x-4 gap-y-1 text-xs text-white/90">
              <li>
                <Link
                  to="/about-us"
                  className="inline-flex items-center hover:underline"
                >
                  Sobre nós
                </Link>
              </li>
              <li>
                <Link
                  to="/contact-us"
                  className="inline-flex items-center hover:underline"
                >
                  Contactos
                </Link>
              </li>
              <li>
                <Link
                  to="/privacy-policy"
                  className="inline-flex items-center hover:underline"
                >
                  Política de Privacidade
                </Link>
              </li>
              <li>
                <Link
                  to="/faq"
                  className="inline-flex items-center hover:underline"
                >
                  FAQs
                </Link>
              </li>
            </ul>
          </nav>

          {/* Newsletter compacto */}
          <div>
            <h2 className="font-semibold mb-2 text-sm">
              Subscreve a nossa newsletter
            </h2>
            <p className="text-xs text-white/80 mb-2">
              Novidades, artigos e recursos no teu e-mail.
            </p>

            <form
              className="flex flex-col space-y-2"
              onSubmit={(e) => {
                e.preventDefault();
                // TODO: form newsletter
              }}
            >
              <div className="flex items-stretch gap-2">
                <input
                  id="newsletter-email"
                  name="email"
                  type="email"
                  required
                  autoComplete="email"
                  placeholder="E-mail"
                  className="w-full md:w-48 h-9 rounded-md px-2 text-xs text-gray-900 placeholder-gray-500 outline-none border border-white/30 bg-white"
                />
                <button
                  type="submit"
                  className="h-9 px-3 rounded-md bg-[#94B4C1] text-white font-medium hover:opacity-90 inline-flex items-center justify-center min-w-[100px] text-xs"
                >
                  Subscrever
                </button>
              </div>

              <label className="flex items-start gap-2 text-2xs text-white/80 leading-tight">
                <input
                  type="checkbox"
                  required
                  className="mt-0.5 h-3 w-3 rounded border-white/40"
                />
                Autorizo comunicações de marketing por e-mail e posso cancelar a
                qualquer momento. Ver Política de Privacidade.
              </label>
            </form>
          </div>
        </div>

        {/* Bottom bar mais compacto */}
        <div className="py-3 text-center">
          <p className="text-2xs md:text-xs text-white/70">
            © {new Date().getFullYear()} Tiago Sousa. Todos os direitos
            reservados.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
