import { useQuery } from "@tanstack/react-query";
import PostCard from "../components/cards/PostCard";
import CreateNewPost from "../components/overlays/CreateNewPost";
import { getAllPosts } from "../shared/services/posts";
import type { Post } from "../shared/types/post/Post";
import { useSelector } from "react-redux";
import type { RootState } from "../redux/store/store";
import GridLoading from "../components/loaders/GridLoading";

export default function Home() {
  // const fakePosts: Post[] = posts;
  let posts: Post[] = [];
  const loggedInUser = useSelector(
    (state: RootState) => state.currentUser.user
  );

  const fetchPosts = async () => {
    try {
      posts = await getAllPosts();
    } catch (error) {
      console.error("Error fetching posts:", error);
    }
    return posts;
  };

  const {
    data: allPosts,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["all-posts"],
    queryFn: fetchPosts,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  if (error) {
    throw error;
  }
  return (
    <div className="flex flex-col items-center min-h-screen">
      {loggedInUser && <CreateNewPost />}
      {isLoading ? (
        <div className="min-h-[80vh] text-xl gap-2 flex justify-center items-center flex-col">
          <GridLoading />
          <p>Loading posts</p>
        </div>
      ) : (
        <>
          {allPosts && allPosts.length > 0 ? (
            <div className="posts flex flex-col gap-5 mb-4">
              {allPosts.map((post) => (
                <PostCard key={post.id} post={post} />
              ))}
            </div>
          ) : (
            <p className="text-xl text-gray-400 font-semibold">
              No posts available!
            </p>
          )}
        </>
      )}
    </div>
  );
}
