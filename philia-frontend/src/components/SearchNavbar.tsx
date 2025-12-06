import { NavLink } from "react-router-dom";

export default function SearchNavbar() {
  return (
    <div className="w-full flex justify-center gap-4 py-4">
      <NavLink
        to="all"
        className={({ isActive }) => {
          return `text-sm rounded-full w-20 text-center px-3 py-1 ${
            isActive ? "bg-blue-800" : "backdrop-blur-lg bg-white/10"
          }`;
        }}
      >
        All
      </NavLink>
      <NavLink
        to="users"
        className={({ isActive }) => {
          return `text-sm rounded-full w-20 text-center px-3 py-1 ${
            isActive ? "bg-blue-800" : "backdrop-blur-lg bg-white/10"
          }`;
        }}
      >
        Users
      </NavLink>
      <NavLink
        to="posts"
        className={({ isActive }) => {
          return `text-sm rounded-full w-20 text-center px-3 py-1 ${
            isActive ? "bg-blue-800" : "backdrop-blur-lg bg-white/10"
          }`;
        }}
      >
        Posts
      </NavLink>
    </div>
  );
}
