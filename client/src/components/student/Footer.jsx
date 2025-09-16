// components/layout/Footer.tsx
import React from "react";
import { Link } from "react-router-dom";
import logo from "/logo.jpg";

const Footer = () => {
  return (
    <footer role="contentinfo" className="bg-[#213448] text-white w-full mt-10">
      <div className="mx-auto max-w-7xl px-6 md:px-10">
        {/* Top grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10 md:gap-12 py-10 border-b border-white/20">
          {/* Brand + copy */}
          <div className="flex gap-4">
            <img
              src={logo}
              alt="tsAcademy"
              className="w-16 h-16 md:w-20 md:h-20 rounded-full object-cover flex-shrink-0"
              loading="lazy"
              decoding="async"
            />
            <p className="text-sm md:text-base text-white/80 leading-relaxed">
              A nossa plataforma é dedicada a fornecer educação de qualidade a
              qualquer pessoa, em qualquer lugar. Estamos comprometidos com o
              teu sucesso desde o primeiro clique.
            </p>
          </div>

          {/* Navegação do site */}
          <nav aria-label="Links da empresa" className="md:pl-4">
            <h2 className="font-semibold mb-4 md:mb-5">Empresa</h2>
            <ul className="flex md:flex-col flex-wrap gap-x-6 gap-y-2 text-sm text-white/90">
              <li>
                <Link
                  to="/about-us"
                  className="inline-flex items-center min-h-[44px] hover:underline"
                >
                  Sobre nós
                </Link>
              </li>
              <li>
                <Link
                  to="/contact-us"
                  className="inline-flex items-center min-h-[44px] hover:underline"
                >
                  Contactos
                </Link>
              </li>
              <li>
                <Link
                  to="/privacy-policy"
                  className="inline-flex items-center min-h-[44px] hover:underline"
                >
                  Política de Privacidade
                </Link>
              </li>
              <li>
                <Link
                  to="/faq"
                  className="inline-flex items-center min-h-[44px] hover:underline"
                >
                  FAQs
                </Link>
              </li>
            </ul>
          </nav>

          {/* Newsletter (com consentimento explícito) */}
          <div>
            <h2 className="font-semibold mb-3 md:mb-5">
              Subscreve a nossa newsletter
            </h2>
            <p className="text-sm text-white/80">
              As últimas novidades, artigos e recursos, diretamente no teu
              e-mail.
            </p>

            <form
              className="mt-4 space-y-3"
              onSubmit={(e) => {
                e.preventDefault();
                // TODO: submeter para o teu endpoint de newsletter
              }}
            >
              <label htmlFor="newsletter-email" className="sr-only">
                E-mail
              </label>
              <div className="flex items-stretch gap-2">
                <input
                  id="newsletter-email"
                  name="email"
                  type="email"
                  required
                  autoComplete="email"
                  placeholder="Insere o teu e-mail"
                  className="w-full md:w-64 h-11 rounded-md px-3 text-sm text-gray-900 placeholder-gray-500 outline-none border border-white/30 bg-white"
                />
                <button
                  type="submit"
                  className="h-11 px-4 rounded-md bg-[#94B4C1] text-white font-medium hover:opacity-90 transition inline-flex items-center justify-center min-w-[120px]"
                >
                  Subscrever
                </button>
              </div>

              {/* Consentimento claro para marketing por e-mail */}
              <label className="flex items-start gap-2 text-xs text-white/80 leading-relaxed">
                <input
                  type="checkbox"
                  required
                  className="mt-0.5 h-4 w-4 rounded border-white/40"
                />
                Autorizo o envio de comunicações de marketing por e-mail e
                compreendo que posso cancelar a subscrição a qualquer momento.
                Consulta a nossa{" "}
                <Link to="/privacy-policy" className="underline">
                  Política de Privacidade
                </Link>
                .
              </label>
            </form>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="py-5 text-center">
          <p className="text-xs md:text-sm text-white/70">
            © {new Date().getFullYear()} Tiago Sousa. Todos os direitos
            reservados.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
