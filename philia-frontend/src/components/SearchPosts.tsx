import { useSelector } from "react-redux";
import type { RootState } from "../redux/store/store";
import PostCard from "./cards/PostCard";

export default function SearchPosts() {
  const posts = useSelector(
    (state: RootState) => state.search.searchResult?.posts
  );
  return (
    <div className="flex flex-col items-center justify-center">
      {!posts || posts.length === 0 ? (
        <p className="text-xl text-gray-400 font-semibold">
          No posts found for your search!
        </p>
      ) : (
        <div className="posts flex flex-col gap-5 mb-4">
          {posts.map((post) => (
            <PostCard key={post.id} post={post} />
          ))}
        </div>
      )}
    </div>
  );
}
