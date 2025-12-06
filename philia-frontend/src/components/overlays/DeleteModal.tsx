import { faTrashAlt } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useState } from "react";
import { Modal } from "react-responsive-modal";
import "react-responsive-modal/styles.css";
import CircleLoading from "../loaders/CircleLoading";

export default function DeleteModal({
  text,
  deleteFn,
  setShowOptions,
  isLoading,
}: {
  text: string;
  deleteFn: () => Promise<void>;
  setShowOptions: (isOpened: boolean) => void;
  isLoading: boolean;
}) {
  const [open, setOpen] = useState(false);

  const onModalClose = () => {
    setOpen(false);
    setShowOptions(false);
  };

  const handleDelete = async () => {
    await deleteFn();
    onModalClose();
  };

  return (
    <div>
      <button
        className="py-1.5 flex gap-2 justify-center items-center w-full cursor-pointer hover:bg-white/10 transition-colors duration-200"
        onClick={() => setOpen(true)}
      >
        <FontAwesomeIcon icon={faTrashAlt} />
        Delete
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
          <h2 className="text-xl font-semibold mb-3">Please confirm</h2>

          <p className="w-full p-3 rounded text-white outline-none focus:border-blue-400">
            {text}
          </p>

          {/* Buttons */}
          <div className="flex justify-end mt-5 gap-3">
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
              disabled={isLoading}
            >
              Cancel
            </button>

            {/* Delete */}
            <button
              onClick={handleDelete}
              className="
      px-4 py-2 cursor-pointer 
      rounded-lg text-white
      bg-red-600/60 backdrop-blur-md
      border border-red-300/20
      transition-all duration-300
      hover:bg-red-600/80 hover:shadow-lg hover:shadow-red-500/20
      active:scale-95 disabled:opacity-60 disabled:cursor-not-allowed
      flex justify-center items-center gap-2
    "
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  Deleting <CircleLoading width="16" height="16" />
                </>
              ) : (
                "Delete"
              )}
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
