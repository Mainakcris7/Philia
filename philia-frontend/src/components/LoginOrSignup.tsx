import { NavLink } from "react-router-dom";

export default function LoginOrSignup() {
  return (
    <div className="text-center text-lg text-bold">
      Please{" "}
      <NavLink to="/auth/login" className="text-blue-500 hover:underline">
        Login
      </NavLink>{" "}
      or{" "}
      <NavLink to="/auth/register" className="text-blue-500 hover:underline">
        Sign Up
      </NavLink>{" "}
      to continue.
    </div>
  );
}
