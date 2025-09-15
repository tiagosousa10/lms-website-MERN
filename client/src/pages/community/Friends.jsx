// pages/FriendsPage.jsx
import React, { useContext, useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { Search as SearchIcon, X as XIcon, UserMinus } from "lucide-react";
import { AppContext } from "../../context/AppContext";
import { assets } from "../../assets/assets";

const normalize = (string = "") =>
  String(string)
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");

export default function Friends() {
  const { userFriends = [], removeFriend, isEducator } = useContext(AppContext);

  const [loading, setLoading] = useState(false);
  // —— estado da pesquisa + debounce (mesmo padrão da tua SearchBar)
  const [query, setQuery] = useState("");
  const [debouncedQuery, setDebouncedQuery] = useState("");

  useEffect(() => {
    const t = setTimeout(() => setDebouncedQuery(query.trim()), 300);
    return () => clearTimeout(t);
  }, [query]);

  const filteredFriends = useMemo(() => {
    const q = normalize(debouncedQuery);
    if (!q) return userFriends;
    return userFriends.filter((f) => {
      const name = normalize(f?.name ?? "");
      const email = normalize(f?.email ?? "");
      return name.includes(q) || email.includes(q);
    });
  }, [debouncedQuery, userFriends]);

  const onSearchSubmit = (e) => {
    e.preventDefault(); // não navega; só filtra
  };

  const [removingId, setRemovingId] = useState(null);
  const handleRemove = async (id) => {
    try {
      setRemovingId(id);
      await Promise.resolve(removeFriend(id)); // caso seja async no teu contexto
    } finally {
      setRemovingId(null);
    }
  };

  return (
    <div className="min-h-screen px-6 md:px-20 py-12 space-y-10 mx-auto relative">
      {/* Header */}
      <header className="flex items-end justify-between">
        <div>
          <h1 className="text-3xl font-bold">Amigos</h1>
          <p className="text-base-content/70">
            Gerir a tua rede de aprendizagem.
          </p>
        </div>
      </header>

      {/* SearchBar — MESMO look&feel  SearchBar */}
      <div className="absolute top-6  left-1/2 -translate-x-1/2">
        <form
          role="search"
          aria-label="Pesquisar amigos"
          onSubmit={onSearchSubmit}
          className="
            relative
            w-[300px] md:w-[360px]
            h-8 md:h-10
            flex items-center
            rounded-full bg-white text-slate-700
            ring-1 ring-black/5
            focus-within:ring-2 focus-within:ring-sky-400
            transition
          "
        >
          {/* Ícone à esquerda (decorativo) */}
          <SearchIcon className="absolute left-3 h-4 w-4 text-slate-500/80 pointer-events-none" />
          {/* Input */}
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            type="search"
            placeholder="Pesquisar por nome ou e-mail…"
            className="
              flex-1 h-full pl-10 pr-10 bg-transparent
              text-xs md:text-base
              placeholder:text-xs md:placeholder:text-xs
              placeholder:text-slate-500/80
              outline-none
            "
            aria-label="Termo de pesquisa"
          />
          {/* Limpar */}
          {query && (
            <button
              type="button"
              onClick={() => setQuery("")}
              className="mr-1 size-6 grid place-content-center rounded-full hover:bg-slate-100"
              aria-label="Limpar pesquisa"
              title="Limpar"
            >
              <XIcon className="h-4 w-4 text-slate-600" />
            </button>
          )}
          {/* Botão circular */}
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
            <SearchIcon className="h-4 w-4 text-white" />
            <span className="sr-only">Pesquisar</span>
          </button>
        </form>
      </div>

      {/* Contagem de resultados quando há query */}
      {debouncedQuery && (
        <h3 className="text-sm md:text-base text-base-content/70">
          Resultados para “{debouncedQuery}”
          <span className="ml-2">({filteredFriends?.length ?? 0})</span>
        </h3>
      )}

      {/* Lista / Estados */}
      {loading ? (
        <div className="flex justify-center py-12">
          <span className="loading loading-spinner loading-lg" />
        </div>
      ) : !filteredFriends?.length ? (
        <div className="card bg-[#547792] text-white shadow p-6 text-center">
          <h3 className="text-lg font-semibold">Sem resultados</h3>
          <p className="opacity-80">Tenta outro nome ou e-mail.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredFriends.map((f) => (
            <div
              key={f._id}
              className="card card-sm shadow hover:shadow-md transition rounded-lg overflow-hidden bg-[#547792]"
            >
              <div className="card-body p-4 space-y-2">
                {/* Avatar + Nome */}
                <div className="flex items-center gap-3">
                  <div className="avatar">
                    <div className="w-12 h-12 rounded-full overflow-hidden ring-2 ring-primary ring-offset-2">
                      <img
                        src={f.imageUrl || assets.profile_img}
                        alt={f.name || "Amigo"}
                      />
                    </div>
                  </div>

                  <div className="flex justify-between flex-1">
                    <div>
                      <h3 className="text-md font-semibold truncate text-white">
                        {f.name}
                      </h3>
                      <p className="text-sm text-base-content/60 truncate">
                        {f.email}
                      </p>
                    </div>
                    <div className="ml-3">
                      <h4 className="text-sm mr-2 border border-[#ECEFCA] text-[#ECEFCA] px-3 py-0.5 rounded">
                        {isEducator ? "Professor" : "Aluno"}
                      </h4>
                    </div>
                  </div>
                </div>

                {/* Descrição */}
                <p className="text-xs text-white/80">
                  Inicia uma conversa e continuem a aprender juntos.
                </p>

                {/* Botões de ação */}
                <div className="flex items-center gap-2">
                  <Link
                    to={`/community/chat/${f._id}`}
                    className="btn btn-ghost btn-sm flex-1 normal-case bg-[#94B4C1] text-white"
                    title="Enviar mensagem"
                  >
                    Mensagem
                  </Link>
                  <button
                    className="py-1.5 rounded-lg px-6 flex items-center gap-2 normal-case bg-red-400 hover:bg-red-500 text-white disabled:opacity-60"
                    title="Remover amigo"
                    onClick={() => handleRemove(f._id)}
                    disabled={loading || removingId === f._id}
                  >
                    <UserMinus className="w-4 h-4" />
                    Remover
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
