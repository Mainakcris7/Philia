import { useLocation } from "react-router-dom";
import SearchAll from "./SearchAll";
import SearchUsers from "./SearchUsers";
import SearchPosts from "./SearchPosts";
import { useSelector } from "react-redux";
import type { RootState } from "../redux/store/store";

export default function SearchResult() {
  const currentUrl = useLocation().pathname;
  const searchResult = useSelector(
    (state: RootState) => state.search.searchResult
  );
  console.log(searchResult);
  let content;
  if (currentUrl.endsWith("/all")) {
    content = <SearchAll />;
  } else if (currentUrl.endsWith("/users")) {
    content = <SearchUsers />;
  } else if (currentUrl.endsWith("/posts")) {
    content = <SearchPosts />;
  }

  return (
    <div className="w-[600px] flex relative flex-col justify-center items-center">
      {searchResult &&
      (searchResult.users.length > 0 || searchResult.posts.length > 0) ? (
        content
      ) : (
        <p className="text-xl text-gray-400 font-semibold">
          No results found for your search!
        </p>
      )}
    </div>
  );
}
