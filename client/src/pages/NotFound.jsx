// src/pages/NotFound.js
import React from "react";
import { Link } from "react-router-dom";

const NotFound = () => {
  return (
    <section className="flex items-center h-full p-16 dark:bg-gray-50 dark:text-gray-800">
      <div className="container flex flex-col items-center justify-center px-5 mx-auto my-8">
        <div className="max-w-md text-center">
          <h2 className="mb-8 font-extrabold text-9xl dark:text-gray-400">
            <span className="sr-only">Erro</span>404
          </h2>
          <p className="text-2xl font-semibold md:text-3xl">
            Lamentamos, não encontrámos esta página.
          </p>
          <p className="mt-4 mb-8 dark:text-gray-600">
            Mas não te preocupes, há muito mais para descobrir na nossa página
            inicial.
          </p>
          <Link
            rel="noopener noreferrer"
            to="/"
            className="px-8 py-3 font-semibold rounded bg-blue-600 text-gray-50"
          >
            Voltar à página inicial
          </Link>
        </div>
      </div>
    </section>
  );
};

export default NotFound;
