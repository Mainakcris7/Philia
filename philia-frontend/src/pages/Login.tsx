import { NavLink } from "react-router-dom";
import LoginImage from "../assets/login.png";
import { useForm } from "react-hook-form";
import type z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { loginSchema } from "../schema/forms";
import type { UserLogin } from "../shared/types/auth/UserLogin";
import { useLogin } from "../hooks/useLogin";
import type { AxiosError } from "axios";
import { toast, Bounce } from "react-toastify";
import CircleLoading from "../components/loaders/CircleLoading";

export default function Login() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<z.infer<typeof loginSchema>>({
    resolver: zodResolver(loginSchema),
    mode: "all",
  });

  const { mutate, isPending, reset, isError, error } = useLogin();

  const handleFormSubmit = async (data: UserLogin) => {
    mutate(data);
  };

  if (isError) {
    console.log(error);
    let errMessage = (
      (error as AxiosError).response?.data as { message?: string }
    )?.message;

    errMessage = errMessage ?? (error as AxiosError).message;
    errMessage = errMessage ?? "Something went wrong!";
    toast.error(`${errMessage}`, {
      position: "top-right",
      autoClose: 3000,
      hideProgressBar: false,
      closeOnClick: false,
      pauseOnHover: true,
      draggable: true,
      theme: "colored",
      transition: Bounce,
    });
    reset(); // Reset error state
  }
  return (
    <div
      className="w-[900px] relative flex backdrop-blur-lg border border-white/20 shadow-lg rounded-lg gap-2 transition-all duration-300"
      style={{ backgroundColor: "rgba(255, 255, 255, 0.1)" }}
    >
      {/* Left Side Image */}
      <div className="img flex flex-1 justify-center items-center p-2">
        <img src={LoginImage} alt="login-img" className="w-[90%]" />
      </div>

      {/* Right Side Login Form */}
      <div className="login-form flex flex-1 flex-col justify-center items-center gap-4 p-6">
        <form
          className="flex flex-col w-[80%] gap-4"
          onSubmit={handleSubmit(handleFormSubmit)}
          noValidate
        >
          <h2 className="text-2xl font-semibold mb-2 text-center">
            Login to Your Account
          </h2>

          {/* Email */}
          <div className="flex relative flex-col w-full ">
            <label htmlFor="email" className="text-sm mb-1">
              Email
            </label>
            <input
              {...register("email")}
              type="email"
              id="email"
              className={`
                px-3 py-2 rounded border-2 ${
                  errors.email
                    ? "border-red-400 focus:border-red-500"
                    : "border-white/30 focus:border-blue-400"
                } bg-transparent outline-none  transition`}
              placeholder="you@example.com"
            />
            {errors.email && (
              <p className="text-red-500 text-sm relative -bottom-1">
                {errors.email.message}
              </p>
            )}
          </div>

          {/* Password */}
          <div className="flex relative flex-col">
            <label htmlFor="password" className="text-sm mb-1">
              Password
            </label>
            <input
              {...register("password")}
              type="password"
              id="password"
              className={`
                px-3 py-2 rounded border-2 ${
                  errors.password
                    ? "border-red-400 focus:border-red-500"
                    : "border-white/30 focus:border-blue-400"
                } bg-transparent outline-none  transition`}
              placeholder="••••••••"
            />
            {errors.password && (
              <p className="text-red-500 text-sm relative -bottom-1">
                {errors.password.message}
              </p>
            )}
          </div>

          {/* Login Button */}
          <button
            className="mt-2 flex justify-center items-center gap-2 cursor-pointer bg-blue-500 hover:bg-blue-600 text-white py-2 rounded transition disabled:opacity-60 disabled:cursor-not-allowed"
            disabled={isPending}
          >
            {isPending ? (
              <>
                Login <CircleLoading width="18" height="18" />
              </>
            ) : (
              "Login"
            )}
          </button>

          {/* Register Link */}
          <p className="text-sm text-center text-gray-300 mt-2">
            Don't have an account?{" "}
            <NavLink
              to="/auth/register"
              className="text-blue-400 hover:underline"
            >
              Register
            </NavLink>
          </p>
        </form>
      </div>
    </div>
  );
}
