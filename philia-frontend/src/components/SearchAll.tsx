import { useSelector } from "react-redux";
import SearchPosts from "./SearchPosts";
import SearchUsers from "./SearchUsers";
import type { RootState } from "../redux/store/store";

export default function SearchAll() {
  const searchResult = useSelector(
    (state: RootState) => state.search.searchResult!
  );
  return (
    <div>
      {searchResult.users.length > 0 && (
        <>
          <h1 className="text-2xl mt-2 text-center font-bold mb-2">Users</h1>
          <SearchUsers />
        </>
      )}
      {searchResult.posts.length > 0 && (
        <>
          <h1 className="text-2xl mt-2 text-center font-bold mb-2">Posts</h1>
          <SearchPosts />
        </>
      )}
    </div>
  );
}
