import { APP_CONFIG } from "../../shared/config/appconfig";
import userIcon from "../../assets/user-icon.png";
import type { UserDto } from "../../shared/types/user/UserDto";

export default function FriendCard({ friend }: { friend: UserDto }) {
  const fullName = friend.firstName + " " + friend.lastName;

  return (
    <div
      className="w-[30vw] relative flex justify-between items-center backdrop-blur-lg border border-white/20 shadow-lg rounded gap-2"
      style={{ backgroundColor: "rgba(255, 255, 255, 0.1)" }}
    >
      <div className="avatar flex items-center py-2 px-2">
        <img
          src={
            friend.profileImageUrl
              ? `${APP_CONFIG.API_URL}${friend.profileImageUrl}`
              : userIcon
          }
          alt={`${friend.firstName} ${friend.lastName}`}
          className="w-20 h-20 rounded-full bg-gray-800 object-contain outline-1"
        />
      </div>
      <div className="details relative flex-1 flex flex-col py-2 h-full">
        <span className="font-semibold text-md">{fullName}</span>
      </div>
    </div>
  );
}
