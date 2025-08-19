import { CheckCircleIcon, UserMinus, UserPlusIcon } from "lucide-react";
import { useContext } from "react";
import { Link } from "react-router-dom";
import { AppContext } from "../../context/AppContext";

const FriendCard = ({ friend }) => {
  console.log("🚀 ~ FriendCard ~ friend:", friend);
  const { removeFriend } = useContext(AppContext);
  return (
    <div className="card card-sm bg-base-100 shadow hover:shadow-md transition rounded-lg overflow-hidden">
      <div className="card-body p-4 space-y-2">
        {/* Avatar + Nome + Línguas */}
        <div className="flex items-center gap-3">
          <div className="avatar">
            <div className="w-12 h-12 rounded-full overflow-hidden ring-2  ring-primary ring-offset-2">
              <img src={friend.imageUrl} alt={friend.nomeCompleto} />
            </div>
          </div>

          <div className="min-w-0 flex-1">
            <h3 className="text-md font-semibold truncate">{friend.name}</h3>
            <p className="text-sm text-base-content/60 truncate">
              {friend.email}
            </p>
          </div>
        </div>

        {/* Botões de ação */}
        <div className="flex items-center gap-2">
          <Link
            to={`/community/chat/${friend._id}`}
            className="btn btn-ghost btn-sm flex-1 normal-case"
          >
            Mensagem
          </Link>
          <button
            className="py-1.5 rounded-lg px-8 flex items-center gap-2 normal-case
             bg-gradient-to-r from-[#60A5FA] to-[#3B82F6]
             hover:from-[#4F8AE6] hover:to-[#2563EB]
             text-white"
            onClick={() => removeFriend(friend._id)}
          >
            <UserMinus className="w-4 h-4" />
            Remover
          </button>
        </div>
      </div>
    </div>
  );
};

export default FriendCard;
