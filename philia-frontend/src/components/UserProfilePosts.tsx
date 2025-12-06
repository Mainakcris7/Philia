import PostCard from "../components/cards/PostCard";
import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { getPostsByUserId } from "../shared/services/users";
import CircleLoading from "./loaders/CircleLoading";

export default function UserProfilePosts() {
  const { userId } = useParams();
  const id = Number(userId!);

  // 2. Load posts with React Query only for other users
  const {
    data: queriedPosts,
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ["user-posts", id],
    queryFn: () => getPostsByUserId(id),
  });

  // Decide which posts to show
  const posts = queriedPosts;

  if (isLoading) {
    return (
      <div className="text-xl mt-5 text-gray-400 font-semibold flex justify-center items-center">
        Loading posts <CircleLoading width="20" height="20" />
      </div>
    );
  }

  if (isError) {
    return (
      <p className="text-xl mt-5 text-red-400 font-semibold">
        Error: {(error as Error).message}
      </p>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center mb-5">
      {posts && posts.length > 0 ? (
        <>
          <h1 className="text-2xl font-bold mt-5 mb-2 text-gray-200">Posts</h1>
          <div className="posts flex flex-col gap-5 mb-4">
            {posts.map((post) => (
              <PostCard key={post.id} post={post} />
            ))}
          </div>
        </>
      ) : (
        <p className="text-xl mt-5 text-gray-400 font-semibold">
          No posts found!
        </p>
      )}
    </div>
  );
}
