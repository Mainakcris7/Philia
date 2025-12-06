import { useEffect, useState } from "react";
import { Modal } from "react-responsive-modal";
import "react-responsive-modal/styles.css";
import type { RootState } from "../../redux/store/store";
import { useDispatch, useSelector } from "react-redux";
import userIcon from "../../assets/user-icon.png";
import { updateUserProfileImage } from "../../shared/services/users";
import { updateProfileImage } from "../../redux/slices/user";
import { APP_CONFIG } from "../../shared/config/appconfig";
import CircleLoading from "../loaders/CircleLoading";

export default function UpdateProfileImage() {
  const loggedInUser = useSelector(
    (state: RootState) => state.currentUser.user
  );
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [image, setImage] = useState<File | null>(null);
  const [isPreviewLoading, setIsPreviewLoading] = useState(false);
  const preview = loggedInUser?.profileImageUrl;
  const [previewInModal, setPreviewInModal] = useState<string | undefined>(
    loggedInUser?.profileImageUrl
  );

  const dispatch = useDispatch();

  const handleUpdateProfileImage = async () => {
    if (!loggedInUser) return;

    setLoading(true);
    const formData = new FormData();
    if (image) formData.append("profileImage", image);
    try {
      const profileImgUrl = await updateUserProfileImage(
        loggedInUser.id,
        formData
      );
      console.log("Profile image updated successfully:", profileImgUrl);
      dispatch(updateProfileImage({ newProfileImageUrl: profileImgUrl }));
    } catch (err) {
      console.error("Error updating profile image: " + err);
    } finally {
      setLoading(false);
      setOpen(false);
    }
  };

  const removeProfileImage = () => {
    setImage(null);
    setPreviewInModal(undefined);
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setImage(file);
    setIsPreviewLoading(true);

    const reader = new FileReader();
    reader.onloadend = () => {
      setPreviewInModal(reader.result as string);
      setIsPreviewLoading(false);
    };
    reader.readAsDataURL(file);
  };

  const onModalClose = () => {
    setPreviewInModal(loggedInUser?.profileImageUrl);
    setOpen(false);
    setIsPreviewLoading(false);
  };

  useEffect(() => {
    setPreviewInModal(loggedInUser?.profileImageUrl);
  }, [loggedInUser?.profileImageUrl]);

  return (
    <div>
      <button
        className="flex justify-center items-center flex-col rounded-full cursor-pointer hover:border-white/50 transition group text-white/70 hover:text-white w-40 h-40 relative"
        onClick={() => setOpen(true)}
      >
        {preview ? (
          <img
            src={`${APP_CONFIG.API_URL}${preview}`}
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
        <div className="w-[400px]">
          <h2 className="text-xl font-semibold mb-3">Update Profile Image</h2>

          {isPreviewLoading ? (
            // Loading State while reading file
            <div className="flex justify-center items-center w-40 h-40 rounded-full border-2 border-dashed border-white/30 mx-auto mt-6 mb-10">
              <CircleLoading width="32" height="32" />
            </div>
          ) : (
            <label
              className="flex justify-center items-center flex-col rounded-full cursor-pointer hover:border-white/50 transition group text-white/70 hover:text-white w-40 h-40 relative mx-auto mt-6 mb-10"
              htmlFor="image-upload"
            >
              {previewInModal ? (
                <img
                  src={
                    previewInModal.includes("/users")
                      ? `${APP_CONFIG.API_URL}${previewInModal}`
                      : previewInModal
                  }
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

          {/* Buttons */}
          <div className="flex justify-between mt-5 gap-3">
            {/* Cancel */}
            <button
              onClick={onModalClose}
              className="
                    px-4 py-2 cursor-pointer 
                    rounded-lg text-white
                    bg-white/10 backdrop-blur-md
                    border border-white/20
                    transition-all duration-300
                    hover:bg-white/20 hover:shadow-lg hover:shadow-white/10
                    active:scale-95 disabled:opacity-60 disabled:cursor-not-allowed"
              disabled={loading}
            >
              Cancel
            </button>

            {/* Update / remove image*/}
            <div className="update-remove flex gap-2">
              <button
                onClick={removeProfileImage}
                className="
                px-4 py-2 cursor-pointer 
                rounded-lg text-white
                bg-blue-600/60 backdrop-blur-md
                border border-blue-300/20
                transition-all duration-300
                hover:bg-blue-600/80 hover:shadow-lg hover:shadow-blue-500/20
                active:scale-95 disabled:opacity-60 disabled:cursor-not-allowed
    "
                disabled={loading}
              >
                Remove
              </button>
              <button
                onClick={handleUpdateProfileImage}
                className="
                px-4 py-2 cursor-pointer 
                rounded-lg text-white
                bg-blue-600/60 backdrop-blur-md
                border border-blue-300/20
                transition-all duration-300
                hover:bg-blue-600/80 hover:shadow-lg hover:shadow-blue-500/20
                active:scale-95 disabled:opacity-60 disabled:cursor-not-allowed
                flex justify-center items-center gap-2
    "
                disabled={loading}
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
          </div>
        </div>
      </Modal>
    </div>
  );
}
