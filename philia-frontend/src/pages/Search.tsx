import { Outlet, useNavigate } from "react-router-dom";
import SearchBar from "../components/SearchBar";
import { useEffect, useState } from "react";
import SearchNavbar from "../components/SearchNavbar";
import { searchByKeyword } from "../shared/services/api";
import { useDispatch, useSelector } from "react-redux";
import {
  setSearchLoading,
  setSearchNotLoading,
  setSearchResult,
} from "../redux/slices/search";
import type { RootState } from "../redux/store/store";

export default function Search() {
  const [searchInput, setSearchInput] = useState("");
  const searchResult = useSelector(
    (state: RootState) => state.search.searchResult
  );
  const navigate = useNavigate();
  const dispatch = useDispatch();

  useEffect(() => {
    // Clear search results when component unmounts
    return () => {
      dispatch(setSearchResult({ searchResult: null }));
    };
  }, [dispatch]);

  const setSearchValue = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.value.trim() === "") {
      setSearchInput("");
      return;
    }
    setSearchInput(e.target.value);
  };

  const handleSearchSubmit = async () => {
    console.log("clicked" + searchInput.trim());
    if (searchInput.trim() === "") return;
    console.log("Search submitted for:", searchInput);

    try {
      dispatch(setSearchLoading());
      const result = await searchByKeyword(searchInput);
      dispatch(setSearchResult({ searchResult: result }));
    } catch (error) {
      console.error(error);
    } finally {
      dispatch(setSearchNotLoading());
      navigate("all");
    }
  };

  return (
    <div className="flex flex-col justify-center items-center h-full w-full">
      <SearchBar
        setSearchValue={setSearchValue}
        handleSearchSubmit={handleSearchSubmit}
      />
      {searchResult ? (
        <>
          <SearchNavbar />
          <Outlet />
        </>
      ) : (
        <p className="text-xl mt-5 text-gray-400 font-semibold">
          Your search result will appear here
        </p>
      )}
    </div>
  );
}
