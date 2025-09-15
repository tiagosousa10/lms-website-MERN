// pages/FriendsPage.jsx
import React, { useContext, useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { Search as SearchIcon, X as XIcon, UserMinus } from "lucide-react";
import { motion } from "framer-motion"; // animações
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
  const [query, setQuery] = useState("");
  const [debouncedQuery, setDebouncedQuery] = useState("");
  const [removingId, setRemovingId] = useState(null);

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

  const onSearchSubmit = (e) => e.preventDefault();

  const handleRemove = async (id) => {
    try {
      setRemovingId(id);
      setLoading(true);
      await Promise.resolve(removeFriend(id)); // caso seja async no teu contexto
    } finally {
      setLoading(false);
      setRemovingId(null);
    }
  };

  // classes partilhadas p/ grelha e cards — altura uniforme
  const gridClasses =
    "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-6 auto-rows-[minmax(0,1fr)]";
  const cardBase =
    "card shadow hover:shadow-lg transition rounded-2xl overflow-hidden bg-[#547792] h-full flex";
  const roleBadge =
    "text-sm border border-[#ECEFCA] text-[#ECEFCA] px-3 py-1 rounded-md";

  // framer-motion variants
  const containerV = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { when: "beforeChildren", staggerChildren: 0.06 },
    },
  };
  const itemV = {
    hidden: { opacity: 0, y: 8 },
    show: { opacity: 1, y: 0, transition: { duration: 0.25 } },
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

      {/* SearchBar — mesmo look&feel */}
      <div className="absolute top-6 left-1/2 -translate-x-1/2">
        <form
          role="search"
          aria-label="Pesquisar amigos"
          onSubmit={onSearchSubmit}
          className="relative w-[300px] md:w-[360px] h-10 flex items-center rounded-full bg-white text-slate-700 ring-1 ring-black/5 focus-within:ring-2 focus-within:ring-sky-400 transition"
        >
          <SearchIcon className="absolute left-3 h-4 w-4 text-slate-500/80 pointer-events-none" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            type="search"
            placeholder="Pesquisar por nome ou e-mail…"
            className="flex-1 h-full pl-9 pr-10 bg-transparent text-sm outline-none placeholder:text-slate-500/80"
            aria-label="Termo de pesquisa"
          />
          {query && (
            <button
              type="button"
              onClick={() => setQuery("")}
              className="mr-2 size-7 grid place-content-center rounded-full hover:bg-slate-100"
              aria-label="Limpar pesquisa"
              title="Limpar"
            >
              <XIcon className="h-4 w-4 text-slate-600" />
            </button>
          )}
          <button
            type="submit"
            className="mr-2 size-8 rounded-full grid place-content-center bg-[#94b4c1] hover:opacity-90 active:opacity-100 focus:outline-hidden focus:ring-2 focus:ring-sky-400 transition"
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
      {loading && !removingId ? (
        <div className="flex justify-center py-12">
          <span className="loading loading-spinner loading-lg" />
        </div>
      ) : !filteredFriends?.length ? (
        <div className={`${cardBase} items-center justify-center p-8`}>
          <div className="text-center space-y-1">
            <h3 className="text-lg font-semibold text-white">Sem resultados</h3>
            <p className="text-white/80">Tenta outro nome ou e-mail.</p>
          </div>
        </div>
      ) : (
        <motion.div
          className={gridClasses}
          variants={containerV}
          initial="hidden"
          animate="show"
        >
          {filteredFriends.map((f) => (
            <motion.div
              key={f._id}
              variants={itemV}
              whileHover={{ y: -2 }}
              whileTap={{ scale: 0.995 }}
              className={cardBase}
            >
              <div className="card-body p-4 space-y-3 flex-1">
                {/* Top: Avatar + Nome + Papel */}
                <div className="flex items-center justify-between gap-3">
                  <div className="flex items-center gap-4 min-w-0">
                    <div className="avatar shrink-0">
                      <div className="w-12 h-12 rounded-full overflow-hidden ring-2 ring-primary ring-offset-2">
                        <img
                          src={f.imageUrl || assets.profile_img}
                          alt={f.name || "Amigo"}
                        />
                      </div>
                    </div>
                    <div className="min-w-0">
                      <h3 className="text-md font-semibold truncate text-white">
                        {f.name || "—"}
                      </h3>
                      <p className="text-sm text-base-content/60 truncate">
                        {f.email || "—"}
                      </p>
                    </div>
                  </div>

                  <span className={roleBadge}>
                    {isEducator ? "Professor" : "Aluno"}
                  </span>
                </div>

                {/* Descrição (opcional) */}
                <p className="text-xs text-white/80">
                  Inicia uma conversa e continuem a aprender juntos.
                </p>

                {/* Ações */}
                <div className="mt-auto flex items-center gap-2">
                  <Link
                    to={`/community/chat/${f._id}`}
                    className="btn btn-ghost btn-sm flex-1 normal-case bg-[#94B4C1] text-white hover:opacity-90"
                    title="Enviar mensagem"
                  >
                    Mensagem
                  </Link>

                  <button
                    className="btn btn-sm normal-case bg-red-500 hover:bg-red-600 text-white flex items-center gap-2 disabled:opacity-60"
                    title="Remover amigo"
                    onClick={() => handleRemove(f._id)}
                    disabled={loading || removingId === f._id}
                  >
                    {removingId === f._id && (
                      <span className="loading loading-spinner loading-xs" />
                    )}
                    <UserMinus className="w-4 h-4" />
                    Remover
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      )}
    </div>
  );
}
