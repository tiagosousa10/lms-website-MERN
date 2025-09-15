import {
  CheckCircleIcon,
  UserPlusIcon,
  UsersIcon,
  Search as SearchIcon,
  X as XIcon,
} from "lucide-react";
import React, { useContext, useEffect, useMemo } from "react";
import { Link } from "react-router-dom";
import Loading from "../../components/student/Loading";
import NoFriendsFound from "../../components/community/NoFriendsFound";
import FriendCard from "../../components/community/FriendCard";
import { assets } from "../../assets/assets";
import { AppContext } from "../../context/AppContext";

const normalize = (string) =>
  (string || "")
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");

const CommunityPage = () => {
  const [isLoading, setIsLoading] = React.useState(false);

  const {
    userFriends = [],
    recommendedUsers = [],
    sendFriendRequest,
    onGoingFriends = [],
    isEducator,
  } = useContext(AppContext);

  // pedidos de amizade já enviados (para desativar botão)
  const outgoingSet = useMemo(
    () => new Set(onGoingFriends.map((fr) => String(fr?.recipient?._id))),
    [onGoingFriends]
  );

  // estado da pesquisa + debounce
  const [query, setQuery] = React.useState("");
  const [debouncedQuery, setDebouncedQuery] = React.useState("");

  useEffect(() => {
    const t = setTimeout(() => setDebouncedQuery(query.trim()), 300);
    return () => clearTimeout(t);
  }, [query]);

  // resultados combinados (amigos + sugestões)
  const friendIdSet = useMemo(
    () => new Set(userFriends.map((f) => String(f._id || f.id))),
    [userFriends]
  );

  const combinedResults = useMemo(() => {
    const q = normalize(debouncedQuery);
    if (!q) return null;

    const results = [];

    userFriends.forEach((f) => {
      const name = f?.name ?? "";
      const email = f?.email ?? "";
      if (normalize(name).includes(q) || normalize(email).includes(q)) {
        results.push({
          _id: String(f._id || f.id),
          name,
          email,
          type: "friend",
          avatar: f?.imageUrl,
        });
      }
    });

    recommendedUsers.forEach((u) => {
      const id = String(u._id || u.id);
      if (friendIdSet.has(id)) return;
      const name = u?.name ?? "";
      const email = u?.email ?? "";
      if (normalize(name).includes(q) || normalize(email).includes(q)) {
        results.push({
          _id: id,
          name,
          email,
          type: "suggestion",
          avatar: u?.imageUrl,
        });
      }
    });

    return results;
  }, [debouncedQuery, userFriends, recommendedUsers, friendIdSet]);

  const onSearchSubmit = (e) => e.preventDefault();

  // Classes partilhadas p/ grelhas de cards (altura igual)
  const gridClasses =
    "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-6 auto-rows-[minmax(0,1fr)]";

  // Classes partilhadas p/ card (mesma estética do FriendCard)
  const cardBase =
    "card shadow hover:shadow-md transition rounded-2xl overflow-hidden bg-[#547792] h-full flex";

  const roleBadge =
    "text-sm border border-[#ECEFCA] text-[#ECEFCA] px-3 py-1 rounded-md";

  const actionBtnBase =
    "btn btn-sm normal-case flex items-center justify-center gap-2";

  return (
    <div className="min-h-screen p-4 md:p-8 lg:p-12 relative">
      {/* SearchBar */}
      <div className="max-w-2xl absolute top-16 left-1/2 -translate-x-1/2">
        <form
          role="search"
          aria-label="Pesquisar amigos e recomendações"
          onSubmit={onSearchSubmit}
          className="w-[300px] md:w-[360px] h-10 flex items-center rounded-full bg-white text-slate-700 ring-1 ring-black/5 focus-within:ring-2 focus-within:ring-sky-400 transition relative"
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

      {/* Resultados de pesquisa */}
      {debouncedQuery ? (
        <div className="space-y-4">
          <h3 className="text-xl font-semibold">
            Resultados para “{debouncedQuery}”
            <span className="ml-2 text-base-content/60">
              ({combinedResults?.length ?? 0})
            </span>
          </h3>

          {isLoading ? (
            <div className="flex justify-center py-12">
              <span className="loading loading-spinner loading-lg" />
            </div>
          ) : (combinedResults?.length ?? 0) === 0 ? (
            <div className="py-12">
              <div className={`${cardBase} items-center justify-center p-6`}>
                <div className="text-center space-y-1">
                  <h4 className="text-lg font-semibold text-white">
                    Sem resultados
                  </h4>
                  <p className="text-base-content/70">
                    Tenta outro nome ou e-mail.
                  </p>
                </div>
              </div>
            </div>
          ) : (
            <div className="py-12">
              <div className={gridClasses}>
                {combinedResults.map((item) =>
                  item.type === "friend" ? (
                    <FriendCard
                      key={`friend-${item._id}`}
                      friend={{
                        _id: item._id,
                        name: item.name,
                        email: item.email,
                        imageUrl: item.avatar,
                      }}
                    />
                  ) : (
                    <div key={`sug-${item._id}`} className={cardBase}>
                      <div className="card-body p-4 space-y-3 flex-1">
                        <div className="flex items-center justify-between">
                          <div className="flex gap-4">
                            <div className="avatar">
                              <div className="w-12 h-12 rounded-full overflow-hidden ring-2 ring-primary ring-offset-2">
                                <img
                                  src={item.avatar || assets.profile_img}
                                  alt="Perfil"
                                />
                              </div>
                            </div>
                            <div>
                              <h3 className="text-md font-semibold truncate text-white">
                                {item.name || "Utilizador"}
                              </h3>
                              <p className="text-sm text-base-content/60 truncate">
                                {item.email || "—"}
                              </p>
                            </div>
                          </div>
                          <span className={roleBadge}>Sugestão</span>
                        </div>

                        <div className="mt-auto">
                          <button
                            className={`${actionBtnBase} w-[70%] mx-auto ${
                              outgoingSet.has(item._id)
                                ? "btn-disabled text-white/70 bg-white/10"
                                : "bg-[#94B4C1] text-white hover:opacity-90"
                            }`}
                            disabled={outgoingSet.has(item._id) || isLoading}
                            onClick={() => sendFriendRequest(item._id)}
                          >
                            {outgoingSet.has(item._id) ? (
                              <>
                                <CheckCircleIcon className="w-4 h-4" />
                                Pedido Enviado
                              </>
                            ) : (
                              <>
                                <UserPlusIcon className="w-4 h-4" />
                                Adicionar Amigo
                              </>
                            )}
                          </button>
                        </div>
                      </div>
                    </div>
                  )
                )}
              </div>
            </div>
          )}
        </div>
      ) : (
        <>
          {/* Descobrir mais amigos */}
          <div className="space-y-6">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
              <div>
                <h2 className="text-3xl font-bold">Encontrar Novos Amigos</h2>
                <p className="text-base-content/70">
                  Descobre parceiros de aprendizagem com base no teu perfil.
                </p>
              </div>
            </div>

            {isLoading ? (
              <div className="flex justify-center py-12">
                <span className="loading loading-spinner loading-lg" />
              </div>
            ) : recommendedUsers.length === 0 ? (
              <div className="card bg-base-100 shadow p-6 text-center">
                <h3 className="text-xl font-semibold">
                  Sem recomendações por agora
                </h3>
                <p className="text-base-content/70">
                  Volta mais tarde para novos parceiros!
                </p>
              </div>
            ) : (
              <div className={gridClasses}>
                {recommendedUsers.map((u) => {
                  const pedidoEnviado = outgoingSet.has(String(u._id));
                  return (
                    <div key={u._id || u.id} className={cardBase}>
                      <div className="card-body p-4 space-y-3 flex-1">
                        <div className="flex items-center justify-between">
                          <div className="flex gap-4">
                            <div className="avatar">
                              <div className="w-12 h-12 rounded-full overflow-hidden ring-2 ring-primary ring-offset-2">
                                <img
                                  src={u.imageUrl || assets.profile_img}
                                  alt={u.name || "Perfil"}
                                />
                              </div>
                            </div>
                            <div>
                              <h3 className="text-md font-semibold truncate text-white">
                                {u.name || "Utilizador"}
                              </h3>
                              <p className="text-sm text-base-content/60 truncate">
                                {u.email || "—"}
                              </p>
                            </div>
                          </div>
                          <div className={roleBadge}>
                            {isEducator ? "Professor" : "Aluno"}
                          </div>
                        </div>

                        <div className="mt-auto">
                          <button
                            className={`${actionBtnBase} w-[70%] mx-auto ${
                              pedidoEnviado
                                ? "btn-disabled text-white/70 bg-white/10"
                                : "bg-[#94B4C1] text-white hover:opacity-90"
                            }`}
                            disabled={pedidoEnviado || isLoading}
                            onClick={() => sendFriendRequest(u._id)}
                          >
                            {pedidoEnviado ? (
                              <>
                                <CheckCircleIcon className="w-4 h-4" />
                                Pedido Enviado
                              </>
                            ) : (
                              <>
                                <UserPlusIcon className="w-4 h-4" />
                                Adicionar Amigo
                              </>
                            )}
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Header Amigos */}
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mt-12">
            <h2 className="text-3xl font-bold mb-4">Os teus Amigos</h2>
            <Link
              to="/community/friends"
              className="btn btn-outline btn-sm flex items-center border-[#213448] text-[#213448]"
            >
              <UsersIcon className="w-4 h-4" /> Amigos
            </Link>
          </div>

          {/* Lista de Amigos */}
          {isLoading ? (
            <Loading />
          ) : userFriends.length === 0 ? (
            <NoFriendsFound />
          ) : (
            <div className={gridClasses}>
              {userFriends.map((friend) => (
                <FriendCard key={friend._id || friend.id} friend={friend} />
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default CommunityPage;
