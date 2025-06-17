import { Link } from "react-router-dom";
import { assets } from "../../assets/assets";

const FriendCard = ({ friend }) => {
  return (
    <div className="card bg-base-200 hover:shadow-md transition-shadow">
      <div className="card-body p-4 cursor-pointer">
        {/* USER INFO  */}
        <div className="flex items-center gap-3 mb-3">
          <div className="avatar size-12">
            <img src={assets.profile_img} alt={friend.fullName} />
          </div>
          <h3 className="font-semibold truncate">{friend.fullName}</h3>
        </div>

        {/* ACTIONS */}
        <div className="flex flex-wrap gap-1.5 mb-3">
          <span className="badge badge-secondary text-xs">
            {friend.fullName}
          </span>

          <span className="badge badge-outline text-xs">{friend.id}</span>
        </div>

        <Link to={`/chat/${friend._id}`} className="btn btn-outline w-full">
          Mensagem
        </Link>
      </div>
    </div>
  );
};

export default FriendCard;
