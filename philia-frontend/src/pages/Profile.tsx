import ProfileCard from "../components/cards/ProfileCard";
import UserPosts from "../components/UserPosts";

export default function Profile() {
  return (
    <div className="flex flex-col justify-center items-center">
      <ProfileCard />
      <UserPosts />
    </div>
  );
}
