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

  const user = {
    fullName: "Joana Silva",
    email: "joana.silva@example.com",
    password: "senhaSegura123", // Deve ter no mínimo 6 caracteres
    bio: "Apaixonada por línguas e culturas.",
    profilePic: "https://example.com/images/joana.jpg",
    nativeLanguage: "Português",
    learningLanguage: "Inglês",
    location: "Lisboa, Portugal",
    isOnboarded: true,
    friends: ["userIdExample", "anotherTest"], // Lista de IDs de amigos referenciados
  };

  const friends = [
    {
      id: "friend1",
      fullName: "Maria Oliveira",
      profilePic: "https://example.com/images/maria.jpg",
      nativeLanguage: "Português",
      learningLanguage: "Espanhol",
    },
    {
      id: "friend2",
      fullName: "Pedro Santos",
      profilePic: "https://example.com/images/pedro.jpg",
      nativeLanguage: "Inglês",
      learningLanguage: "Francês",
    },
    // Adicione mais amigos conforme necessário
  ];

  console.log("friends", friends);

  return (
    <div className="p-4 sm:p-6 lg:p-8">
      <div className="container mx-auto space-y-10">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <h2 className="text-2xl sm:text-3xl font-bold tracking-tight">
            Your Friends
          </h2>
          <Link to="/notifications" className="btn btn-outline btn-sm">
            <UsersIcon className="mr-2 size-4" />
            Friends
          </Link>
        </div>

        {isLoading ? (
          <Loading />
        ) : friends.length === 0 ? (
          <NoFriendsFound />
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {friends.map((friend) => (
              <FriendCard key={friend._id} friend={friend} />
            ))}
          </div>
        )}

        <section>
          <div className="mb-6 sm:mb-8">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div>
                <h2 className="text-2xl sm:text-3xl font-bold tracking-tight">
                  Meeting New Friends
                </h2>
                <p className="opacity-70">
                  Discover perfect friends to learn based on your profile
                </p>
              </div>
            </div>

            {isLoading ? (
              <div className="flex justify-center py-12">
                <span className="loading loading-spinner loading-lg" />
              </div>
            ) : friends.length === 0 ? (
              <div className="card bg-base-200 p-6 text-center">
                <h3 className="font-semibold text-lg mb-2">
                  No recommendations available
                </h3>
                <p className="text-base-content opacity-70">
                  Check back later for new language partners!
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {friends.map((user) => {
                  const hasRequestBeenSent = true;

                  return (
                    <div
                      key={user._id}
                      className="card bg-base-200 hover:shadow-lg transition-all duration-300"
                    >
                      <div className="card-body p-5 space-y-4">
                        <div className="flex items-center gap-3">
                          <div className="avatar size-16 rounded-full">
                            <img src={assets.profile_img} alt="" />
                          </div>

                          <div>
                            <h3 className="font-semibold text-lg">
                              {user.fullName}
                            </h3>
                            {user.location && (
                              <div className="flex items-center text-xs opacity-70 mt-1">
                                <MapPinIcon className="size-3 mr-1" />
                                {user.location}
                              </div>
                            )}
                          </div>
                        </div>

                        {/* languages with flags */}
                        <div className="flex flex-wrap gap-1.5">
                          <span className="badge badge-secondary">
                            {friends.fullName}
                          </span>

                          <span className="badge badge-outline">
                            {friends.id}
                          </span>
                        </div>

                        {user.bio && (
                          <p className="text-sm opacity-70">{user.bio}</p>
                        )}

                        {/* action button  */}
                        <button
                          className={`btn w-full mt-2 ${hasRequestBeenSent} ? "btn-disabled" : "btn-primary"`}
                          // onClick={() => sendRequestMutation(user._id)}
                          disabled={isLoading}
                        >
                          {hasRequestBeenSent ? (
                            <>
                              <CheckCircleIcon className="size-4 mr-2" />
                              Request Sent
                            </>
                          ) : (
                            <>
                              <UserPlusIcon className="size-4 mr-2" />
                              Send Request
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
