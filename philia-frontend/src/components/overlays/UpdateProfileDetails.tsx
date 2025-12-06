import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { Modal } from "react-responsive-modal";
import "react-responsive-modal/styles.css";
import type { RootState } from "../../redux/store/store";
import { useDispatch, useSelector } from "react-redux";
import { updateUser as updateUserService } from "../../shared/services/users";
import { updateUserProfile } from "../../redux/slices/user";
import type { UserUpdate } from "../../shared/types/user/UserUpdate";
import { faPencilAlt } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { updateProfileSchema } from "../../schema/forms";
import CircleLoading from "../loaders/CircleLoading";
import { toast, Bounce } from "react-toastify";
import type { AxiosError } from "axios";

export default function UpdateProfileDetails() {
  const loggedInUser = useSelector(
    (state: RootState) => state.currentUser.user
  );
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm({
    resolver: zodResolver(updateProfileSchema),
    mode: "onBlur",
    defaultValues: {
      firstName: loggedInUser?.firstName || "",
      lastName: loggedInUser?.lastName || "",
      about: loggedInUser?.about || "",
      address: {
        street: loggedInUser?.address.street || "",
        city: loggedInUser?.address.city || "",
        state: loggedInUser?.address.state || "",
        country: loggedInUser?.address.country || "",
        zipCode: loggedInUser?.address.zipCode || "",
      },
      dateOfBirth: loggedInUser?.dateOfBirth
        ? new Date(loggedInUser.dateOfBirth).toISOString().split("T")[0]
        : "",
    },
  });

  const onModalClose = () => {
    setOpen(false);
    reset();
  };

  const handleUpdateProfile = async (data: {
    firstName: string;
    lastName: string;
    about: string;
    address: {
      street: string;
      city: string;
      state: string;
      country: string;
      zipCode: string;
    };
    dateOfBirth: string;
  }) => {
    if (!loggedInUser) return;
    setLoading(true);
    try {
      const updateData: UserUpdate = {
        id: loggedInUser.id,
        firstName: data.firstName,
        lastName: data.lastName,
        about: data.about || "",
        address: data.address,
        dateOfBirth: new Date(data.dateOfBirth),
      };
      console.log(updateData);

      await updateUserService(updateData);
      dispatch(
        updateUserProfile({ updatedUser: { ...loggedInUser, ...updateData } })
      );
      toast.success("Profile details updated", {
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
      onModalClose();
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

  return (
    <div>
      <button
        className="edit-profile absolute top-2 right-2 rounded-full backdrop-blur-sm
                                   bg-white/10 w-7 h-7 flex justify-center items-center text-sm cursor-pointer hover:bg-white/20"
        onClick={() => setOpen(true)}
      >
        <FontAwesomeIcon icon={faPencilAlt} />
      </button>

      <Modal
        open={open}
        onClose={onModalClose}
        center
        classNames={{
          overlay: "customOverlay",
          modal: "customModal",
        }}
      >
        <div className="flex flex-col w-[500px]">
          <h2 className="text-xl font-semibold mb-3">Update Profile Details</h2>

          <form
            className="flex flex-col gap-3"
            onSubmit={handleSubmit(handleUpdateProfile)}
          >
            {/* First & Last Name */}
            <div className="flex gap-3">
              <div className="flex flex-col flex-1">
                <label className="text-sm mb-1">First Name</label>
                <input
                  {...register("firstName")}
                  type="text"
                  className={`px-3 py-2 rounded border-2 ${
                    errors.firstName
                      ? "border-red-400 focus:border-red-500"
                      : "border-white/30 focus:border-blue-400"
                  } bg-transparent outline-none transition text-white`}
                  placeholder="First name"
                />
                {errors.firstName && (
                  <span className="text-red-400 text-xs mt-1">
                    {errors.firstName.message}
                  </span>
                )}
              </div>

              <div className="flex flex-col flex-1">
                <label className="text-sm mb-1">Last Name</label>
                <input
                  {...register("lastName")}
                  type="text"
                  className={`px-3 py-2 rounded border-2 ${
                    errors.lastName
                      ? "border-red-400 focus:border-red-500"
                      : "border-white/30 focus:border-blue-400"
                  } bg-transparent outline-none transition text-white`}
                  placeholder="Last name"
                />
                {errors.lastName && (
                  <span className="text-red-400 text-xs mt-1">
                    {errors.lastName.message}
                  </span>
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
                } bg-transparent outline-none h-20 resize-none transition text-white`}
                placeholder="Write something about yourself..."
              />
              {errors.about && (
                <span className="text-red-400 text-xs mt-1">
                  {errors.about.message}
                </span>
              )}
            </div>

            {/* Address Section */}
            <h3 className="font-semibold text-sm mt-2">Address</h3>

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
                } bg-transparent outline-none transition text-white`}
                placeholder="123 Main St"
              />
              {errors.address?.street && (
                <span className="text-red-400 text-xs mt-1">
                  {errors.address.street.message}
                </span>
              )}
            </div>

            {/* City & State */}
            <div className="flex gap-3">
              <div className="flex flex-col flex-1">
                <label className="text-sm mb-1">City</label>
                <input
                  {...register("address.city")}
                  type="text"
                  className={`px-3 py-2 rounded border-2 ${
                    errors.address?.city
                      ? "border-red-400 focus:border-red-500"
                      : "border-white/30 focus:border-blue-400"
                  } bg-transparent outline-none transition text-white`}
                  placeholder="Mumbai"
                />
                {errors.address?.city && (
                  <span className="text-red-400 text-xs mt-1">
                    {errors.address.city.message}
                  </span>
                )}
              </div>

              <div className="flex flex-col flex-1">
                <label className="text-sm mb-1">State</label>
                <input
                  {...register("address.state")}
                  type="text"
                  className={`px-3 py-2 rounded border-2 ${
                    errors.address?.state
                      ? "border-red-400 focus:border-red-500"
                      : "border-white/30 focus:border-blue-400"
                  } bg-transparent outline-none transition text-white`}
                  placeholder="Maharashtra"
                />
                {errors.address?.state && (
                  <span className="text-red-400 text-xs mt-1">
                    {errors.address.state.message}
                  </span>
                )}
              </div>
            </div>

            {/* Country & Zip */}
            <div className="flex gap-3">
              <div className="flex flex-col flex-1">
                <label className="text-sm mb-1">Country</label>
                <input
                  {...register("address.country")}
                  type="text"
                  className={`px-3 py-2 rounded border-2 ${
                    errors.address?.country
                      ? "border-red-400 focus:border-red-500"
                      : "border-white/30 focus:border-blue-400"
                  } bg-transparent outline-none transition text-white`}
                  placeholder="India"
                />
                {errors.address?.country && (
                  <span className="text-red-400 text-xs mt-1">
                    {errors.address.country.message}
                  </span>
                )}
              </div>

              <div className="flex flex-col flex-1">
                <label className="text-sm mb-1">Zip Code</label>
                <input
                  {...register("address.zipCode")}
                  type="text"
                  className={`px-3 py-2 rounded border-2 ${
                    errors.address?.zipCode
                      ? "border-red-400 focus:border-red-500"
                      : "border-white/30 focus:border-blue-400"
                  } bg-transparent outline-none transition text-white`}
                  placeholder="400001"
                />
                {errors.address?.zipCode && (
                  <span className="text-red-400 text-xs mt-1">
                    {errors.address.zipCode.message}
                  </span>
                )}
              </div>
            </div>

            {/* Date of Birth */}
            <div className="flex flex-col mt-2">
              <label className="text-sm mb-1">Date of Birth</label>
              <input
                {...register("dateOfBirth")}
                type="date"
                className={`px-3 py-2 rounded border-2 ${
                  errors.dateOfBirth
                    ? "border-red-400 focus:border-red-500"
                    : "border-white/30 focus:border-blue-400"
                } bg-transparent outline-none transition text-white`}
              />
              {errors.dateOfBirth && (
                <span className="text-red-400 text-xs mt-1">
                  {errors.dateOfBirth.message}
                </span>
              )}
            </div>

            {/* Buttons */}
            <div className="flex justify-end mt-5 gap-3">
              {/* Cancel */}
              <button
                type="button"
                onClick={onModalClose}
                disabled={loading}
                className="
                  px-4 py-2 cursor-pointer 
                  rounded-lg text-white
                  bg-white/10 backdrop-blur-md
                  border border-white/20
                  transition-all duration-300
                  hover:bg-white/20 hover:shadow-lg hover:shadow-white/10
                  active:scale-95
                  disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Cancel
              </button>

              {/* Update */}
              <button
                type="submit"
                disabled={loading}
                className="
                  px-4 py-2 cursor-pointer 
                  rounded-lg text-white
                  bg-blue-600/60 backdrop-blur-md
                  border border-blue-300/20
                  transition-all duration-300
                  hover:bg-blue-600/80 hover:shadow-lg hover:shadow-blue-500/20
                  active:scale-95
                  disabled:opacity-50 disabled:cursor-not-allowed
                  flex justify-center items-center gap-2"
              >
                {loading ? (
                  <>
                    Updating <CircleLoading width="16" height="16" />
                  </>
                ) : (
                  "Update"
                )}
              </button>
            </div>
          </form>
        </div>
      </Modal>
    </div>
  );
}
