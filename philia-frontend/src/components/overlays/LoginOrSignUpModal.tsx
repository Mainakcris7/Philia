import { faHeart } from "@fortawesome/free-regular-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useState } from "react";
import { Modal } from "react-responsive-modal";
import "react-responsive-modal/styles.css";
import { NavLink } from "react-router-dom";

export default function LoginOrSignUpModal({
  btnClasses,
  text,
}: {
  btnClasses: string;
  text?: string;
}) {
  const [open, setOpen] = useState(false);

  const onModalClose = () => {
    setOpen(false);
  };

  return (
    <>
      <button className={btnClasses} onClick={() => setOpen(true)}>
        <FontAwesomeIcon icon={faHeart} />
        <span className="text-md">{text}</span>
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
          <h2 className="w-full p-3 text-xl rounded text-white outline-none focus:border-blue-400">
            Please login or sign up to continue.
          </h2>

          {/* Buttons */}
          <div className="flex justify-end mt-2 gap-3">
            <NavLink
              to="/auth/login"
              className="px-4 py-1.5 cursor-pointer rounded-lg text-white bg-white-600/60 backdrop-blur-md border border-blue-300/20 transition-all duration-300 hover:bg-white-600/80 hover:shadow-lg hover:shadow-blue-50/20 active:scale-95"
            >
              Login
            </NavLink>

            <NavLink
              to="/auth/register"
              className="px-4 py-1.5 cursor-pointer rounded-lg text-white bg-blue-600/60 backdrop-blur-md border border-blue-300/20 transition-all duration-300 hover:bg-blue-600/80 hover:shadow-lg hover:shadow-blue-500/20 active:scale-95"
            >
              Register
            </NavLink>
          </div>
        </div>
      </Modal>
    </>
  );
}
