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
    <div className="p-4 sm:p-6 lg:p-8 ">
      <div className="container mx-auto max-w-4xl space-y-8">
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight mb-6">
          Notificações
        </h1>

        {isLoading ? (
          <div className="flex justify-center py-12">
            <span className="loading loading-spinner loading-lg" />
          </div>
        ) : (
          <>
            {incomingRequests.length > 0 && (
              <section className="space-y-4">
                <h2 className="text-xl font-semibold flex items-center gap-2">
                  <UserCheckIcon className="size-5 text-primary" />
                  Pedidos de Amizade
                  <span className="badge badge-primary ml-2">
                    ({incomingRequests.length})
                  </span>
                </h2>

                <div className="space-y-3">
                  {incomingRequests.map((request) => (
                    <div
                      key={request._id}
                      className="card bg-base-200 shadow-sm hover:shadow-md transition-shadow"
                    >
                      <div className="card-body p-4">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <div className="avatar size-14 rounded-full bg-base-300">
                              <img
                                src={
                                  request.sender?.imageUrl ||
                                  "/default-profile.png"
                                }
                                alt={request.sender?.name || "Utilizador"}
                              />
                            </div>
                            <div>
                              <h3 className="font-semibold">
                                {request.sender?.name}
                              </h3>
                              <div className="flex flex-wrap gap-1.5 mt-1">
                                <span className="badge badge-secondary badge-sm">
                                  {request.sender?.email}
                                </span>
                              </div>
                            </div>
                          </div>

                          <button
                            className="btn btn-primary btn-sm"
                            onClick={() => handleAccept(request._id)}
                          >
                            Aceitar
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* accepted requests notifications */}
            {acceptedRequests.length > 0 && (
              <section className="space-y-4">
                <h2 className="text-xl font-semibold flex items-center gap-2">
                  <BellIcon className="size-5 text-success" />
                  Novas Conexões
                </h2>

                <div className="space-y-3">
                  {acceptedRequests.map((notification) => (
                    <div
                      key={notification._id}
                      className="card bg-base-200 shadow-sm"
                    >
                      <div className="card-body p-4">
                        <div className="flex items-start gap-3">
                          <div className="avatar mt-1 size-10 rounded-full">
                            <img
                              src={
                                notification.recipient?.imageUrl ||
                                "/default-profile.png"
                              }
                              alt={notification.recipient?.name || "Amigo"}
                            />
                          </div>

                          <div className="flex-1">
                            <h3 className="font-semibold">
                              {notification.recipient?.name}
                            </h3>
                            <p className="text-sm my-1">
                              {notification.recipient?.name} aceitou o teu
                              pedido de amizade.
                            </p>
                            <p className="text-xs flex items-center opacity-70">
                              <ClockIcon className="size-3 mr-1" />
                              Recentemente
                            </p>
                          </div>
                          <div className="badge badge-success">
                            <MessagesSquareIcon className="size-3 mr-1" />
                            Novo Amigo
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            )}

            {incomingRequests.length === 0 && acceptedRequests.length === 0 && (
              <NoNotificationsFound />
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default Notifications;
