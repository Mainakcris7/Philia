import UserProfileCard from "../components/cards/UserProfileCard";
import UserProfilePosts from "../components/UserProfilePosts";

export default function UserProfile() {
  return (
    <div className="flex flex-col justify-center items-center">
      <UserProfileCard />
      <UserProfilePosts />
    </div>
  );
}
