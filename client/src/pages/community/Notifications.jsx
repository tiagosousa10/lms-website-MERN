import {
  BellIcon,
  ClockIcon,
  MessagesSquareIcon,
  UserCheckIcon,
} from "lucide-react";
import { useContext } from "react";
import { AppContext } from "../../context/AppContext";
import NoNotificationsFound from "../../components/community/NoNotificationsFound";

const Notifications = () => {
  const {
    friendRequests,
    acceptFriendRequest,
    getFriendRequests,
    getUserFriends,
  } = useContext(AppContext);

  const isLoading = !friendRequests || Object.keys(friendRequests).length === 0;

  const incomingRequests = friendRequests?.incomingReqs || [];
  const acceptedRequests = friendRequests?.acceptedReqs || [];

  const handleAccept = async (requestId) => {
    await acceptFriendRequest(requestId);
    await getFriendRequests();
    await getUserFriends();
  };

  return (
    <div className="min-h-screen px-6 md:px-20 py-12 space-y-10">
      {/* Título */}
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-base-content">Notificações</h1>
      </div>

      {/* Pedidos de Amizade */}
      {isLoading ? (
        <div className="flex justify-center py-12">
          <span className="loading loading-spinner loading-lg text-primary" />
        </div>
      ) : (
        <>
          {incomingRequests.length > 0 && (
            <section className="space-y-6">
              <div className="flex items-center gap-3">
                <UserCheckIcon className="text-primary size-6" />
                <h2 className="text-xl font-semibold text-base-content">
                  Pedidos de Amizade
                </h2>
                <span className="badge badge-primary badge-sm">
                  {incomingRequests.length}
                </span>
              </div>

              <div className="grid gap-4">
                {incomingRequests.map((request) => (
                  <div
                    key={request._id}
                    className="card bg-base-100 border border-base-200 shadow-sm hover:shadow-md transition-shadow"
                  >
                    <div className="card-body flex items-center justify-between p-4">
                      <div className="flex items-center gap-4">
                        <div className="avatar">
                          <div className="w-14 rounded-full ring ring-primary ring-offset-base-100 ring-offset-2">
                            <img
                              src={
                                request.sender?.imageUrl ||
                                "/default-profile.png"
                              }
                              alt={request.sender?.name || "Utilizador"}
                            />
                          </div>
                        </div>
                        <div>
                          <h3 className="text-base font-semibold text-base-content">
                            {request.sender?.name}
                          </h3>
                          <p className="text-sm text-base-content/70">
                            {request.sender?.email}
                          </p>
                        </div>
                      </div>

                      <button
                        className="btn btn-sm btn-primary"
                        onClick={() => handleAccept(request._id)}
                      >
                        Aceitar
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Notificações de conexões aceites */}
          {acceptedRequests.length > 0 && (
            <section className="space-y-6">
              <div className="flex items-center gap-3">
                <BellIcon className="text-success size-6" />
                <h2 className="text-xl font-semibold text-base-content">
                  Novas Conexões
                </h2>
              </div>

              <div className="grid gap-4">
                {acceptedRequests.map((notification) => (
                  <div
                    key={notification._id}
                    className="card bg-base-100 border border-base-200 shadow-sm"
                  >
                    <div className="card-body flex gap-4 p-4">
                      <div className="avatar mt-1">
                        <div className="w-10 rounded-full ring ring-success ring-offset-base-100 ring-offset-2">
                          <img
                            src={
                              notification.recipient?.imageUrl ||
                              "/default-profile.png"
                            }
                            alt={notification.recipient?.name || "Amigo"}
                          />
                        </div>
                      </div>

                      <div className="flex-1">
                        <h3 className="font-semibold">
                          {notification.recipient?.name}
                        </h3>
                        <p className="text-sm text-base-content/70">
                          {notification.recipient?.name} aceitou o teu pedido de
                          amizade.
                        </p>
                        <p className="text-xs flex items-center opacity-70 mt-1">
                          <ClockIcon className="size-3 mr-1" />
                          Recentemente
                        </p>
                      </div>

                      <div className="badge badge-success self-start mt-1">
                        <MessagesSquareIcon className="size-3 mr-1" />
                        Novo Amigo
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Nada encontrado */}
          {incomingRequests.length === 0 && acceptedRequests.length === 0 && (
            <NoNotificationsFound />
          )}
        </>
      )}
    </div>
  );
};

export default Notifications;
