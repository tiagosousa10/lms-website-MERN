// src/pages/NotFound.jsx
import React from "react";
import { Link } from "react-router-dom";

const NotFound = () => {
  return (
    <main
      className="min-h-screen w-full bg-white"
      role="main"
      aria-labelledby="nf-title"
    >
      <section className="container mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-20 flex items-center">
        <div className="w-full text-center sm:text-left grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
          {/* Coluna 1 — Mensagem */}
          <div>
            <p className="text-sm font-medium tracking-wide text-slate-500">
              Erro <span className="sr-only">código</span> 404
            </p>

            <h1
              id="nf-title"
              className="mt-2 text-4xl xs:text-5xl sm:text-6xl font-extrabold tracking-tight text-slate-800"
            >
              Página não encontrada
            </h1>

            <p
              className="mt-4 text-slate-600 max-w-prose"
              role="status"
              aria-live="polite"
            >
              Lamentamos, não encontrámos a página que procuras. Provavelmente o
              endereço foi alterado ou existe um erro no link.
            </p>

            {/* Ações de recuperação */}
            <div className="mt-8 flex flex-col sm:flex-row gap-3 sm:gap-4">
              <Link
                to="/"
                className="inline-flex items-center justify-center h-11 px-6 rounded-md bg-[#2563eb] text-white hover:bg-[#1d4ed8] focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-[#2563eb]"
              >
                Voltar à página inicial
              </Link>

              <Link
                to="/course-list"
                className="inline-flex items-center justify-center h-11 px-6 rounded-md border border-slate-300 text-slate-800 hover:bg-slate-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-slate-300"
              >
                Explorar cursos
              </Link>
            </div>

            {/* Dica / Contacto */}
            <p className="mt-4 text-sm text-slate-500">
              Se o problema persistir,{" "}
              <a
                className="underline"
                href="mailto:tiagosousa.tams@hotmail.com?subject=404%20na%20tsAcademy"
              >
                contacta o suporte
              </a>
              .
            </p>
          </div>

          {/* Coluna 2 — Ilustração/numeração grande (decorativo) */}
          <div className="hidden lg:block text-right">
            <span
              aria-hidden="true"
              className="select-none font-extrabold tracking-tighter text-slate-200"
              style={{ fontSize: "11rem", lineHeight: 1 }}
            >
              404
            </span>
          </div>
        </div>
      </section>
    </main>
  );
};

export default NotFound;
