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
    <div className="bg-white min-h-screen">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Título */}
        <header className="flex items-center justify-between pt-10 md:pt-16 pb-6">
          <h1 className="text-3xl font-bold">Notificações</h1>
        </header>

        {isLoading ? (
          <div className="flex justify-center py-16">
            <span className="loading loading-spinner loading-lg text-primary" />
          </div>
        ) : (
          <div className="space-y-10">
            {/* Pedidos de Amizade */}
            {incomingRequests.length > 0 && (
              <section className="space-y-4">
                <div className="flex items-center gap-3">
                  <UserCheckIcon className="size-6" />
                  <h2 className="text-xl font-semibold">Pedidos de Amizade</h2>
                  <span className="badge bg-[#94B4C1] text-black border-none">
                    {incomingRequests.length}
                  </span>
                </div>

                <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {incomingRequests.map((request) => (
                    <li
                      key={request._id}
                      className="card shadow hover:shadow-md transition rounded-lg overflow-hidden bg-[#547792]"
                    >
                      <div className="card-body flex items-center justify-between p-4">
                        <div className="flex items-center gap-4 min-w-0">
                          <div className="avatar shrink-0">
                            <div className="w-12 h-12 rounded-full overflow-hidden ring-2 ring-primary ring-offset-2">
                              <img
                                src={
                                  request.sender?.imageUrl ||
                                  "/default-profile.png"
                                }
                                alt={request.sender?.name || "Utilizador"}
                              />
                            </div>
                          </div>
                          <div className="min-w-0">
                            <h3 className="text-md font-semibold text-white truncate">
                              {request.sender?.name}
                            </h3>
                            <p className="text-sm text-white/80 truncate">
                              {request.sender?.email}
                            </p>
                          </div>
                        </div>

                        <button
                          className="h-11 px-6 rounded-lg inline-flex items-center gap-2 bg-[#94B4C1] hover:bg-[#7fa0ad] text-white"
                          onClick={() => handleAccept(request._id)}
                          aria-label={`Aceitar pedido de ${request.sender?.name}`}
                        >
                          Aceitar
                        </button>
                      </div>
                    </li>
                  ))}
                </ul>
              </section>
            )}

            {/* Conexões aceites */}
            {acceptedRequests.length > 0 && (
              <section className="space-y-4">
                <div className="flex items-center gap-3">
                  <BellIcon className="size-6" />
                  <h2 className="text-xl font-semibold">Novas Conexões</h2>
                </div>

                <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {acceptedRequests.map((n) => (
                    <li
                      key={n._id}
                      className="card shadow hover:shadow-md transition rounded-lg overflow-hidden bg-[#547792]"
                    >
                      <div className="card-body flex gap-4 p-4">
                        <div className="avatar mt-1 shrink-0">
                          <div className="w-10 h-10 rounded-full overflow-hidden ring-2 ring-success ring-offset-2">
                            <img
                              src={
                                n.recipient?.imageUrl || "/default-profile.png"
                              }
                              alt={n.recipient?.name || "Amigo"}
                            />
                          </div>
                        </div>

                        <div className="flex-1 min-w-0">
                          <h3 className="font-semibold text-white truncate">
                            {n.recipient?.name}
                          </h3>
                          <p className="text-sm text-white/80 truncate">
                            {n.recipient?.name} aceitou o teu pedido de amizade.
                          </p>
                          <p className="text-xs flex items-center text-white/70 mt-1">
                            <ClockIcon className="size-3 mr-1" />
                            Recentemente
                          </p>
                        </div>

                        <div className="badge bg-green-500 text-white border-none self-start mt-1">
                          <MessagesSquareIcon className="size-3 mr-1" />
                          Novo Amigo
                        </div>
                      </div>
                    </li>
                  ))}
                </ul>
              </section>
            )}

            {incomingRequests.length === 0 && acceptedRequests.length === 0 && (
              <div className="py-10">
                <NoNotificationsFound />
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Notifications;
