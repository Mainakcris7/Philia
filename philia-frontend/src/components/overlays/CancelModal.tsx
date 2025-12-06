import { type IconDefinition } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useState } from "react";
import { Modal } from "react-responsive-modal";
import "react-responsive-modal/styles.css";

export default function CancelModal({
  icon,
  btnClass,
  btnText,
  loadingText,
  text,
  cancelFn,
}: {
  icon: IconDefinition;
  btnClass: string;
  btnText: string;
  loadingText?: string;
  text: string;
  cancelFn: () => Promise<void>;
}) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const onModalClose = () => {
    setOpen(false);
  };

  const handleCancel = async () => {
    setLoading(true);
    try {
      await cancelFn();
      onModalClose();
    } catch (error) {
      console.error("Error during action:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <button className={btnClass} onClick={() => setOpen(true)}>
        <FontAwesomeIcon icon={icon} />
        {btnText}
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

            {/* Delete/Action */}
            <button
              onClick={handleCancel}
              disabled={loading}
              className="
      px-4 py-2 cursor-pointer 
      rounded-lg text-white
      bg-red-600/60 backdrop-blur-md
      border border-blue-300/20
      transition-all duration-300
      hover:bg-red-600/80 hover:shadow-lg hover:shadow-blue-500/20
      active:scale-95
      disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? `${loadingText}` : `${btnText}`}
            </button>
          </div>
        </div>
      </Modal>
    </>
  );
}
