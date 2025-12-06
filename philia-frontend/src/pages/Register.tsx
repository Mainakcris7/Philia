import { NavLink } from "react-router-dom";
import RegisterImage from "../assets/register.png";
import { useForm } from "react-hook-form";
import type z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { registerSchema } from "../schema/forms";
import type { UserRegister } from "../shared/types/auth/UserRegister";
import userIcon from "../assets/user-icon.png";
import OtpVerifier from "./OtpVerifier";
import { useState } from "react";
import { sendOtpToEmail } from "../shared/services/auth";
import CircleLoading from "../components/loaders/CircleLoading";
import type { AxiosError } from "axios";
import { toast, Bounce } from "react-toastify";

export default function Register() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<z.infer<typeof registerSchema>>({
    resolver: zodResolver(registerSchema),
    mode: "all",
  });

  const [registerData, setRegisterData] = useState<UserRegister | null>(null);
  const [image, setImage] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [isPreviewLoading, setIsPreviewLoading] = useState(false);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setImage(file);
    setIsPreviewLoading(true);

    const reader = new FileReader();
    reader.onloadend = () => {
      setPreview(reader.result as string);
      setIsPreviewLoading(false);
    };
    reader.readAsDataURL(file);
  };

  const handleFormSubmit = async (
    data: Omit<UserRegister, "registrationOtp">
  ) => {
    console.log(data);
    try {
      setLoading(true);
      await sendOtpToEmail(data.email);
      setRegisterData({ ...data, registrationOtp: "" });
    } catch (error) {
      let errMessage = (
        (error as AxiosError).response?.data as { message?: string }
      )?.message;

      errMessage = errMessage ?? (error as AxiosError).message;
      toast.error(errMessage, {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: false,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "colored",
        transition: Bounce,
      });
    } finally {
      setLoading(false);
    }
  };

  return registerData ? (
    <OtpVerifier registerData={registerData} profileImage={image} length={6} />
  ) : (
    <div
      className="h-[500px] relative flex items-stretch backdrop-blur-lg border border-white/20 shadow-lg rounded-lg gap-2 transition-all duration-300 pb-3 mb-5"
      style={{ backgroundColor: "rgba(255, 255, 255, 0.1)" }}
    >
      {/* Left Side Image */}
      <div className="flex flex-1 justify-center items-center p-2">
        <img src={RegisterImage} alt="register-img" className="w-[90%]" />
      </div>

      {/* Right Side – Scrollable Form */}
      <div className="w-[400px] flex flex-1 justify-center px-5 py-6 overflow-y-auto overflow-x-hidden max-h-full pb-5">
        <form
          className="flex flex-col gap-3 pb-6"
          onSubmit={handleSubmit(handleFormSubmit)}
          noValidate
        >
          <h2 className="text-2xl font-semibold mb-4 text-center">
            Create Your Account
          </h2>
          <div className="image-upload flex justify-center items-center mt-2 mb-2">
            {isPreviewLoading ? (
              // Loading State while reading file
              <div className="flex justify-center items-center w-40 h-40 rounded-full border-2 border-dashed border-white/30">
                <CircleLoading width="32" height="32" />
              </div>
            ) : (
              <label
                className="flex justify-center items-center flex-col rounded-full cursor-pointer hover:border-white/50 transition group text-white/70 hover:text-white w-40 h-40 relative"
                htmlFor="image-upload"
              >
                {preview ? (
                  <img
                    src={preview}
                    alt="default-user-image"
                    className="rounded-full w-full h-full outline-2 bg-gray-800 object-contain hover:opacity-80 transition-all duration-150"
                  />
                ) : (
                  <img
                    src={userIcon}
                    alt="default-user-image"
                    className="rounded-full hover:opacity-80 transition-all duration-150"
                  />
                )}
                <div
                  className="absolute inset-0 flex items-center justify-center 
                   bg-black bg-opacity-10 text-white text-sm font-semibold 
                   opacity-0 group-hover:opacity-50 transition-opacity duration-300 
                   rounded-full w-full h-full"
                >
                  {/* Dynamic Text based on the 'preview' state */}
                  {preview ? "Change Photo" : "Choose Photo"}
                </div>
              </label>
            )}
            <input
              type="file"
              id="image-upload"
              accept="image/*"
              className="mt-1 hidden"
              onChange={handleImageChange}
            />
          </div>
          {/* First & Last Name */}
          <div className="flex flex-col gap-4">
            {/* First Name */}
            <div className="name flex justify-between w-full">
              <div className="flex flex-col">
                <label className="text-sm mb-1">First Name</label>
                <input
                  {...register("firstName")}
                  type="text"
                  className={`px-3 py-2 rounded border-2 ${
                    errors.firstName
                      ? "border-red-400 focus:border-red-500"
                      : "border-white/30 focus:border-blue-400"
                  } bg-transparent outline-none transition`}
                  placeholder="John"
                />
              </div>

              {/* Last Name */}
              <div className="flex flex-col">
                <label className="text-sm mb1">Last Name</label>
                <input
                  {...register("lastName")}
                  type="text"
                  className={`px-3 py-2 rounded border-2 ${
                    errors.lastName
                      ? "border-red-400 focus:border-red-500"
                      : "border-white/30 focus:border-blue-400"
                  } bg-transparent outline-none transition relative top-1`}
                  placeholder="Doe"
                />
              </div>
            </div>
            <div className="name-errors relative bottom-2 flex flex-col">
              {errors.firstName && (
                <p className="text-red-500 text-sm">
                  {errors.firstName.message}
                </p>
              )}
              {errors.lastName && (
                <p className="text-red-500 text-sm">
                  {errors.lastName.message}
                </p>
              )}
            </div>
          </div>

          {/* About */}
          <div className="flex flex-col">
            <label className="text-sm mb-1">About</label>
            <textarea
              {...register("about")}
              className={`px-3 py-2 rounded border-2 ${
                errors.about
                  ? "border-red-400 focus:border-red-500"
                  : "border-white/30 focus:border-blue-400"
              } bg-transparent outline-none h-20 resize-none transition`}
              placeholder="Write something about yourself..."
            ></textarea>
            {errors.about && (
              <p className="text-red-500 text-sm relative top-1">
                {errors.about.message}
              </p>
            )}
          </div>

          {/* Address Section */}
          <h3 className="font-semibold text-lg mt-2">Address</h3>

          {/* Street */}
          <div className="flex flex-col">
            <label className="text-sm mb-1">Street</label>
            <input
              {...register("address.street")}
              type="text"
              className={`px-3 py-2 rounded border-2 ${
                errors.address?.street
                  ? "border-red-400 focus:border-red-500"
                  : "border-white/30 focus:border-blue-400"
              } bg-transparent outline-none transition`}
              placeholder="123 Main St"
            />
            {errors.address?.street && (
              <p className="text-red-500 text-sm relative top-1">
                {errors.address.street.message}
              </p>
            )}
          </div>

          {/* City & State */}
          <div className="flex gap-4">
            <div className="flex flex-col">
              <label className="text-sm mb-1">City</label>
              <input
                {...register("address.city")}
                type="text"
                className={`px-3 py-2 rounded border-2 ${
                  errors.address?.city
                    ? "border-red-400 focus:border-red-500"
                    : "border-white/30 focus:border-blue-400"
                } bg-transparent outline-none transition`}
                placeholder="Mumbai"
              />
              {errors.address?.city && (
                <p className="text-red-500 text-sm relative top-1">
                  {errors.address.city.message}
                </p>
              )}
            </div>

            <div className="flex flex-col">
              <label className="text-sm mb-1">State</label>
              <input
                {...register("address.state")}
                type="text"
                className={`px-3 py-2 rounded border-2 ${
                  errors.address?.state
                    ? "border-red-400 focus:border-red-500"
                    : "border-white/30 focus:border-blue-400"
                } bg-transparent outline-none transition`}
                placeholder="Maharashtra"
              />
              {errors.address?.state && (
                <p className="text-red-500 text-sm relative top-1">
                  {errors.address.state.message}
                </p>
              )}
            </div>
          </div>

          {/* Country & Zip */}
          <div className="flex gap-4">
            <div className="flex flex-col">
              <label className="text-sm mb-1">Country</label>
              <input
                {...register("address.country")}
                type="text"
                className={`px-3 py-2 rounded border-2 ${
                  errors.address?.country
                    ? "border-red-400 focus:border-red-500"
                    : "border-white/30 focus:border-blue-400"
                } bg-transparent outline-none transition`}
                placeholder="India"
              />
              {errors.address?.country && (
                <p className="text-red-500 text-sm relative top-1">
                  {errors.address.country.message}
                </p>
              )}
            </div>

            <div className="flex flex-col">
              <label className="text-sm mb-1">Zip Code</label>
              <input
                {...register("address.zipCode")}
                type="text"
                className={`px-3 py-2 rounded border-2 ${
                  errors.address?.zipCode
                    ? "border-red-400 focus:border-red-500"
                    : "border-white/30 focus:border-blue-400"
                } bg-transparent outline-none transition`}
                placeholder="400001"
              />
              {errors.address?.zipCode && (
                <p className="text-red-500 text-sm relative top-1">
                  {errors.address.zipCode.message}
                </p>
              )}
            </div>
          </div>

          {/* DOB */}
          <div className="flex flex-col mt-2">
            <label className="text-sm mb-1">Date of Birth</label>
            <input
              {...register("dateOfBirth")}
              type="date"
              className={`px-3 py-2 rounded border-2 ${
                errors.dateOfBirth
                  ? "border-red-400 focus:border-red-500"
                  : "border-white/30 focus:border-blue-400"
              } bg-transparent outline-none transition`}
            />
            {errors.dateOfBirth && (
              <p className="text-red-500 text-sm relative top-1">
                {errors.dateOfBirth.message}
              </p>
            )}
          </div>

          {/* Email */}
          <div className="flex flex-col">
            <label className="text-sm mb-1">Email</label>
            <input
              {...register("email")}
              type="email"
              className={`px-3 py-2 rounded border-2 ${
                errors.email
                  ? "border-red-400 focus:border-red-500"
                  : "border-white/30 focus:border-blue-400"
              } bg-transparent outline-none transition`}
              placeholder="you@example.com"
            />
            {errors.email && (
              <p className="text-red-500 text-sm relative top-1">
                {errors.email.message}
              </p>
            )}
          </div>

          {/* Password */}
          <div className="flex flex-col">
            <label className="text-sm mb-1">Password</label>
            <input
              {...register("password")}
              type="password"
              className={`px-3 py-2 rounded border-2 ${
                errors.password
                  ? "border-red-400 focus:border-red-500"
                  : "border-white/30 focus:border-blue-400"
              } bg-transparent outline-none transition`}
              placeholder="••••••••"
            />
            {errors.password && (
              <p className="text-red-500 text-sm relative top-1">
                {errors.password.message}
              </p>
            )}
          </div>

          {/* Submit */}
          <button
            type="submit"
            className="mt-2 flex justify-center items-center gap-2 cursor-pointer bg-blue-500 hover:bg-blue-600 text-white py-2 rounded transition disabled:opacity-60 disabled:cursor-not-allowed"
            disabled={loading}
          >
            {loading ? (
              <>
                Registering <CircleLoading width="18" height="18" />{" "}
              </>
            ) : (
              "Register"
            )}
          </button>

          <p className="text-sm text-center text-gray-300 mt-2">
            Already have an account?{" "}
            <NavLink to="/auth/login" className="text-blue-400 hover:underline">
              Login
            </NavLink>
          </p>
        </form>
      </div>
    </div>
  );
}
