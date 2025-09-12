import { CheckCircleIcon, UserMinus, UserPlusIcon } from "lucide-react";
import { useContext } from "react";
import { Link } from "react-router-dom";
import { AppContext } from "../../context/AppContext";

const FriendCard = ({ friend }) => {
  console.log("🚀 ~ FriendCard ~ friend:", friend);
  const { removeFriend, isEducator } = useContext(AppContext);
  return (
    <div className="card card-sm   shadow hover:shadow-md transition rounded-lg overflow-hidden bg-[#547792]">
      <div className="card-body p-4 space-y-2 ">
        {/* Avatar + Nome */}
        <div className="flex items-center gap-3">
          <div className="avatar">
            <div className="w-12 h-12 rounded-full overflow-hidden ring-2  ring-primary ring-offset-2">
              <img src={friend.imageUrl} alt={friend.nomeCompleto} />
            </div>
          </div>

          <div className="flex justify-between">
            <div>
              <h3 className="text-md font-semibold truncate text-white">
                {friend.name}
              </h3>
              <p className="text-sm text-base-content/60 truncate">
                {friend.email}
              </p>
            </div>
            <div className="ml-3">
              <h4 className="text-sm mr-8 border border-[#ECEFCA] text-[#ECEFCA] px-4 py-1 ">
                {isEducator ? "Professor" : "Aluno"}
              </h4>
            </div>
          </div>
        </div>

        {/* Botões de ação */}
        <div className="flex items-center gap-2">
          <Link
            to={`/community/chat/${friend._id}`}
            className="btn btn-ghost btn-sm flex-1 normal-case bg-[#94B4C1] text-white "
          >
            Mensagem
          </Link>
          <button
            className="py-1.5 rounded-lg px-8 flex items-center gap-2 normal-case
            bg-red-400
            hover:bg-red-500
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
