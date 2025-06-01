import { UsersIcon } from "lucide-react";
import React from "react";
import { Link } from "react-router-dom";
import Loading from "../../components/student/Loading";
import NoFriendsFound from "../../components/community/NoFriendsFound";
import FriendCard from "../../components/community/FriendCard";

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
      </div>
    </div>
  );
};

export default CommunityPage;
