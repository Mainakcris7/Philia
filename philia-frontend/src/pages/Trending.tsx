import { useQuery } from "@tanstack/react-query";
import PostCard from "../components/cards/PostCard";
import { getTrendingPosts } from "../shared/services/posts";
import CircleLoading from "../components/loaders/CircleLoading";

export default function Trending() {
  const {
    data: trendingPosts,
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ["trending-posts"],
    queryFn: () => getTrendingPosts(),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  if (isError) {
    throw error;
  }
  return (
    <div className="flex flex-col items-center justify-center">
      {isLoading ? (
        <div className="flex items-center justify-center gap-2 text-xl mt-5 text-gray-400 font-semibold">
          Loading trending posts <CircleLoading width="20" height="20" />
        </div>
      ) : !trendingPosts || trendingPosts.length === 0 ? (
        <p className="text-xl mt-5 text-gray-400 font-semibold">
          No trending posts found!
        </p>
      ) : (
        <>
          <h1 className="text-3xl font-bold mb-10">Showing Top 10 posts 🔥</h1>
          <div className="posts flex flex-col gap-6 mb-4">
            {trendingPosts.map((post, i) => (
              <PostCard
                key={post.id}
                isTrending={true}
                trendingNum={i + 1}
                post={post}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
}
