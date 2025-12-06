import { useSelector } from "react-redux";
import PostCard from "../components/cards/PostCard";
import type { RootState } from "../redux/store/store";

export default function UserPosts() {
  const userPosts = useSelector(
    (state: RootState) => state.currentUser.userPosts
  );
  return (
    <div className="flex flex-col items-center justify-center mb-5">
      {" "}
      {userPosts && userPosts.length > 0 ? (
        <>
          {" "}
          <h1 className="text-2xl font-bold mt-5 mb-2 text-gray-200">
            Posts
          </h1>{" "}
          <div className="posts flex flex-col gap-5 mb-4">
            {" "}
            {userPosts.map((post) => (
              <PostCard key={post.id} post={post} />
            ))}{" "}
          </div>{" "}
        </>
      ) : (
        <p className="text-xl mt-5 text-gray-400 font-semibold">
          {" "}
          No posts found!{" "}
        </p>
      )}{" "}
    </div>
  );
}
