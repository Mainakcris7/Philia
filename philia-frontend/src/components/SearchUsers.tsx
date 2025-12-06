import { NavLink } from "react-router-dom";
import SearchUserCard from "./cards/SearchUserCard";
import { useSelector } from "react-redux";
import type { RootState } from "../redux/store/store";

export default function SearchUsers() {
  const users = useSelector(
    (state: RootState) => state.search.searchResult?.users
  );

  return (
    <div className="flex flex-col gap-4 items-center mb-5">
      {!users || users.length === 0 ? (
        <p className="text-xl text-gray-400 font-semibold">
          No users found for your search!
        </p>
      ) : (
        users.map((user, i) => (
          <NavLink to={`/users/${user.id}`} key={i}>
            <SearchUserCard user={user} key={i} />
          </NavLink>
        ))
      )}
    </div>
  );
}
