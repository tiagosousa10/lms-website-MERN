import { UserMinus } from "lucide-react";
import { useContext } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { AppContext } from "../../context/AppContext";

const hoverMotion = {
  whileHover: { y: -1, opacity: 1 },
  transition: { type: "tween", duration: 0.15, ease: "easeOut" },
};

const FriendCard = ({ friend }) => {
  const { removeFriend, isEducator } = useContext(AppContext);

  const friendId = friend?._id || friend?.id;

  return (
    <motion.div
      {...hoverMotion}
      initial={false}
      className="
        card shadow hover:shadow-md transition rounded-2xl overflow-hidden
        bg-[#547792] h-full flex transform-gpu will-change-transform
      "
    >
      <div className="card-body p-4 space-y-3 flex-1">
        {/* Topo: avatar + nome + papel */}
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-4 min-w-0">
            <div className="avatar shrink-0">
              <div className="w-12 h-12 rounded-full overflow-hidden ring-2 ring-primary ring-offset-2">
                <img
                  className="block w-full h-full object-cover"
                  src={friend?.imageUrl || "/default-profile.png"}
                  alt={friend?.name || "Amigo"}
                />
              </div>
            </div>

            <div className="min-w-0">
              <h3 className="text-md font-semibold truncate text-white">
                {friend?.name || "—"}
              </h3>
              <p className="text-sm text-base-content/60 truncate">
                {friend?.email || "—"}
              </p>
            </div>
          </div>

          <span className="text-sm border border-[#ECEFCA] text-[#ECEFCA] px-3 py-1 rounded-md">
            {isEducator ? "Professor" : "Aluno"}
          </span>
        </div>

        {/* Ações */}
        <div className="mt-auto flex items-center gap-2">
          <Link
            to={`/community/chat/${friendId}`}
            className="btn btn-ghost btn-sm flex-1 normal-case bg-[#94B4C1] text-white hover:opacity-90"
            title="Enviar mensagem"
          >
            Mensagem
          </Link>

          <button
            className="btn btn-sm normal-case bg-red-500 hover:bg-red-600 text-white flex items-center gap-2"
            onClick={() => removeFriend(friendId)}
            title="Remover amigo"
          >
            <UserMinus className="w-4 h-4" />
            Remover
          </button>
        </div>
      </div>
    </motion.div>
  );
};

export default FriendCard;
