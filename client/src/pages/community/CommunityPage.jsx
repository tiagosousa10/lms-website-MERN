import {
  CheckCircleIcon,
  MapPinIcon,
  UserPlusIcon,
  UsersIcon,
} from "lucide-react";
import React from "react";
import { Link } from "react-router-dom";
import Loading from "../../components/student/Loading";
import NoFriendsFound from "../../components/community/NoFriendsFound";
import FriendCard from "../../components/community/FriendCard";
import { assets } from "../../assets/assets";

const CommunityPage = () => {
  const [isLoading, setIsLoading] = React.useState(false);

  const utilizador = {
    nomeCompleto: "Joana Silva",
    email: "joana.silva@example.com",
    palavraPasse: "senhaSegura123", // Deve ter no mínimo 6 caracteres
    biografia: "Apaixonada por línguas e culturas.",
    fotoPerfil: "https://example.com/images/joana.jpg",
    linguaNativa: "Português",
    linguaAprender: "Inglês",
    localizacao: "Lisboa, Portugal",
    perfilCompleto: true,
    amigos: ["userIdExample", "anotherTest"],
  };

  const amigos = [
    {
      id: "amigo1",
      nomeCompleto: "Maria Oliveira",
      fotoPerfil: "https://example.com/images/maria.jpg",
      linguaNativa: "Português",
      linguaAprender: "Espanhol",
    },
    {
      id: "amigo2",
      nomeCompleto: "Pedro Santos",
      fotoPerfil: "https://example.com/images/pedro.jpg",
      linguaNativa: "Inglês",
      linguaAprender: "Francês",
    },
    // Pode adicionar mais amigos aqui
  ];

  console.log("amigos", amigos);

  return (
    <div className="p-4 sm:p-6 lg:p-8">
      <div className="container mx-auto space-y-10">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <h2 className="text-2xl sm:text-3xl font-bold tracking-tight">
            Os teus Amigos
          </h2>
          <Link to="/notifications" className="btn btn-outline btn-sm">
            <UsersIcon className="mr-2 size-4" />
            Amigos
          </Link>
        </div>

        {isLoading ? (
          <Loading />
        ) : amigos.length === 0 ? (
          <NoFriendsFound />
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {amigos.map((amigo, index) => (
              <FriendCard key={amigo._id + "-" + index} friend={amigo} />
            ))}
          </div>
        )}

        <section>
          <div className="mb-6 sm:mb-8">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div>
                <h2 className="text-2xl sm:text-3xl font-bold tracking-tight">
                  Conhecer Novos Amigos
                </h2>
                <p className="opacity-70">
                  Descobre parceiros ideais de aprendizagem com base no teu
                  perfil
                </p>
              </div>
            </div>

            {isLoading ? (
              <div className="flex justify-center py-12">
                <span className="loading loading-spinner loading-lg" />
              </div>
            ) : amigos.length === 0 ? (
              <div className="card bg-base-200 p-6 text-center">
                <h3 className="font-semibold text-lg mb-2">
                  Sem recomendações disponíveis
                </h3>
                <p className="text-base-content opacity-70">
                  Volta mais tarde para novos parceiros linguísticos!
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {amigos.map((utilizador, index) => {
                  const pedidoEnviado = true;

                  return (
                    <div
                      key={utilizador._id + "-" + index}
                      className="card bg-base-200 hover:shadow-lg transition-all duration-300"
                    >
                      <div className="card-body p-5 space-y-4">
                        <div className="flex items-center gap-3">
                          <div className="avatar size-16 rounded-full">
                            <img
                              src={assets.profile_img}
                              alt="Foto de perfil"
                            />
                          </div>

                          <div>
                            <h3 className="font-semibold text-lg">
                              {utilizador.nomeCompleto}
                            </h3>
                            {utilizador.localizacao && (
                              <div className="flex items-center text-xs opacity-70 mt-1">
                                <MapPinIcon className="size-3 mr-1" />
                                {utilizador.localizacao}
                              </div>
                            )}
                          </div>
                        </div>

                        {/* línguas */}
                        <div className="flex flex-wrap gap-1.5">
                          <span className="badge badge-secondary">
                            {utilizador.linguaNativa}
                          </span>

                          <span className="badge badge-outline">
                            {utilizador.linguaAprender}
                          </span>
                        </div>

                        {utilizador.biografia && (
                          <p className="text-sm opacity-70">
                            {utilizador.biografia}
                          </p>
                        )}

                        {/* botão de ação */}
                        <button
                          className={`btn w-full mt-2 ${
                            pedidoEnviado ? "btn-disabled" : "btn-primary"
                          }`}
                          disabled={isLoading}
                        >
                          {pedidoEnviado ? (
                            <>
                              <CheckCircleIcon className="size-4 mr-2" />
                              Pedido Enviado
                            </>
                          ) : (
                            <>
                              <UserPlusIcon className="size-4 mr-2" />
                              Enviar Pedido
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
        </section>
      </div>
    </div>
  );
};

export default CommunityPage;
