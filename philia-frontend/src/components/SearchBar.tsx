import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMagnifyingGlass as faMag } from "@fortawesome/free-solid-svg-icons";
import type { RootState } from "../redux/store/store";
import { useSelector } from "react-redux";
import CircleLoading from "./loaders/CircleLoading";

export default function SearchBar({
  handleSearchSubmit,
  setSearchValue,
}: {
  handleSearchSubmit: () => void;
  setSearchValue: (e: React.ChangeEvent<HTMLInputElement>) => void;
}) {
  const isSearchLoading = useSelector(
    (state: RootState) => state.search.isLoading
  );
  return (
    <div className="w-[600px] flex relative flex-col justify-center items-center">
      <input
        type="text"
        name="search"
        id="search"
        className="px-5 py-2 w-full text-md rounded-full border-2 border-gray-300 outline-0"
        placeholder="Search"
        onChange={setSearchValue}
      />
      <button
        className="mt-4 absolute right-0.5 bottom-0.5 px-4 py-2 bg-blue-600 text-white rounded-r-full hover:bg-blue-700 transition-all cursor-pointer duration-200 flex h-[91%] justify-center items-center"
        onClick={handleSearchSubmit}
        disabled={isSearchLoading}
      >
        {isSearchLoading ? (
          <div className="px-px">
            <CircleLoading width="18" height="18" />
          </div>
        ) : (
          <FontAwesomeIcon icon={faMag} />
        )}
      </button>
    </div>
  );
}
