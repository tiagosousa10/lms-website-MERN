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
    <div className="max-w-5xl mx-auto p-4 md:p-8 space-y-6">
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
        <div className="card bg-base-100 shadow p-6 text-center">
          <h3 className="text-lg font-semibold">Ainda não tens amigos</h3>
          <p className="opacity-70">
            Explora a comunidade e começa a conectar-te!
          </p>
        </div>
      ) : (
        <ul className="list bg-base-100 rounded-box shadow-md">
          <li className="p-4 pb-2 text-xs opacity-60 tracking-wide">
            Os teus amigos
          </li>

          {userFriends.map((f) => (
            <li key={f._id} className="list-row">
              {/* Avatar */}
              <div>
                <img
                  className="size-10 rounded-box"
                  src={f.imageUrl || assets.profile_img}
                  alt={f.name || "Amigo"}
                />
              </div>

              <div>
                <div className="font-medium">{f.name}</div>
                <div className="text-xs uppercase font-semibold opacity-60">
                  {f.email}
                </div>
              </div>

              <p className="list-col-wrap text-xs opacity-80">
                Inicia uma conversa e continuem a aprender juntos.
              </p>

              <Link
                to={`/community/chat/${f._id}`}
                className="btn btn-square btn-ghost"
                title="Enviar mensagem"
              >
                <MessageCircle className="size-[1.2em]" />
              </Link>

              <button
                className="btn btn-square btn-ghost"
                title="Remover amigo"
                onClick={() => removeFriend(f._id)}
                disabled={removeFriend === f._id}
              >
                <UserMinus className="size-[1.2em]" />
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
