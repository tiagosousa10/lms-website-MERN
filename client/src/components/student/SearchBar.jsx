import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Search } from "lucide-react";

const SearchBar = ({ data }) => {
  const navigate = useNavigate();
  const [input, setInput] = useState(data ?? "");

  const onSearchHandler = (e) => {
    e.preventDefault();
    const q = String(input || "").trim();
    if (!q) return; // evita navegar sem termo
    navigate("/course-list/" + encodeURIComponent(q));
  };

  return (
    <form
      role="search"
      onSubmit={onSearchHandler}
      className="
        w-[300px] md:w-[360px]
        h-8 md:h-10
        flex items-center
        rounded-full bg-white text-slate-700
        ring-1 ring-black/5
        focus-within:ring-2 focus-within:ring-sky-400
        transition
      "
      aria-label="Pesquisar cursos"
    >
      {/* Input */}
      <input
        onChange={(e) => setInput(e.target.value)}
        value={input}
        type="search"
        placeholder="Pesquisar por curso"
        className="
          flex-1 h-full px-6 bg-transparent
          text-xs md:text-base
          placeholder:text-xs md:placeholder:text-xs
          placeholder:text-slate-500/80
          outline-none
        "
        aria-label="Termo de pesquisa"
      />

      {/* Botão circular (ícone) */}
      <button
        type="submit"
        className="
          mr-2
          size-8
          rounded-full
          grid place-content-center
          bg-[#94b4c1]
          hover:opacity-90
          active:opacity-100
          focus:outline-hidden focus:ring-2 focus:ring-sky-400
          transition
        "
        title="Pesquisar"
        aria-label="Pesquisar"
      >
        <Search className="h-4 w-4 text-white" />
        <span className="sr-only">Pesquisar</span>
      </button>
    </form>
  );
};

export default SearchBar;
