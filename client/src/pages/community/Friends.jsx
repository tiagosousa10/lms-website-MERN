// pages/FriendsPage.jsx
import React, { useContext, useState } from "react";
import { Link } from "react-router-dom";
import { AppContext } from "../../context/AppContext";
import { MessageCircle, UserMinus } from "lucide-react"; // ícones como componentes React
import { assets } from "../../assets/assets";

export default function Friends() {
  const { userFriends, removeFriend } = useContext(AppContext);
  const [loading, setLoading] = useState(false);

  return (
    <div className="min-h-screen px-6 md:px-20 py-12 space-y-10 mx-auto p-4 md:p-8 ">
      <header className="flex items-end justify-between">
        <div>
          <h1 className="text-3xl font-bold">Amigos</h1>
          <p className="text-base-content/70">
            Gerir a tua rede de aprendizagem.
          </p>
        </div>
      </header>

      {loading ? (
        <div className="flex justify-center py-12">
          <span className="loading loading-spinner loading-lg" />
        </div>
      ) : !userFriends?.length ? (
        <div className="card bg-[#547792] text-white shadow p-6 text-center">
          <h3 className="text-lg font-semibold">Ainda não tens amigos</h3>
          <p className="opacity-70">
            Explora a comunidade e começa a conectar-te!
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-4">
          {userFriends.map((f) => (
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
                        Amigo
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
                    className="py-1.5 rounded-lg px-6 flex items-center gap-2 normal-case bg-red-400 hover:bg-red-500 text-white"
                    title="Remover amigo"
                    onClick={() => removeFriend(f._id)}
                    disabled={removeFriend === f._id}
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
