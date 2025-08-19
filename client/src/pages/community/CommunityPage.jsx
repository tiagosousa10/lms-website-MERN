import {
  CheckCircleIcon,
  MapPinIcon,
  UserPlusIcon,
  UsersIcon,
} from "lucide-react";
import React, { useContext } from "react";
import { Link } from "react-router-dom";
import Loading from "../../components/student/Loading";
import NoFriendsFound from "../../components/community/NoFriendsFound";
import FriendCard from "../../components/community/FriendCard";
import { assets } from "../../assets/assets";
import { AppContext } from "../../context/AppContext";

const CommunityPage = () => {
  const [isLoading, setIsLoading] = React.useState(false);

  const { userFriends, recommendedUsers, sendFriendRequest, onGoingFriends } =
    useContext(AppContext);
  console.log("🚀 ~ CommunityPage ~ onGoingFriends:", onGoingFriends);

  //to check if a friend request is outgoing
  const outgoingSet = React.useMemo(() => {
    return new Set(
      (onGoingFriends || []).map((fr) => String(fr?.recipient?._id))
    );
  }, [onGoingFriends]);

  return (
    <div className=" min-h-screen p-4 md:p-8 lg:p-12 space-y-12">
      {/* Nova Secção: Descobrir mais amigos */}
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
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {recommendedUsers.map((u, idx) => {
              // console.log("🚀 ~ u:", u);
              const pedidoEnviado = outgoingSet.has(String(u._id));
              return (
                <div
                  key={u.id || idx}
                  className="card card-sm bg-base-100 shadow hover:shadow-md transition"
                >
                  <div className="card-body p-4 space-y-2">
                    <div className="flex items-center gap-3">
                      <div className="avatar">
                        <div className="w-12 h-12 rounded-full overflow-hidden">
                          <img src={assets.profile_img} alt="Perfil" />
                        </div>
                      </div>
                      <div>
                        <h3 className="text-md font-semibold truncate">
                          {u.name}
                        </h3>
                        <p className="text-sm text-base-content/60 truncate">
                          {u.email}
                        </p>
                      </div>
                    </div>

                    {/* Botão de ação */}
                    <button
                      className={`btn btn-sm w-full ${
                        pedidoEnviado ? "btn-disabled" : "btn-primary"
                      } flex justify-center items-center gap-2`}
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
              );
            })}
          </div>
        )}
      </div>

      {/* Header Amigos */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <h2 className="text-3xl font-bold">Os teus Amigos</h2>
        <Link
          to="/notifications"
          className="btn btn-outline btn-sm flex items-center"
        >
          <UsersIcon className=" w-4 h-4" /> Amigos
        </Link>
      </div>

      {/* Lista de Amigos */}
      {isLoading ? (
        <Loading />
      ) : userFriends.length === 0 ? (
        <NoFriendsFound />
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {userFriends.map((friend, idx) => (
            <FriendCard key={friend.id || idx} friend={friend} />
          ))}
        </div>
      )}
    </div>
  );
};

export default CommunityPage;
