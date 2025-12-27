import {
  faFileImage,
  faFilePen,
  faPencilAlt,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useEffect, useState } from "react";
import { Modal } from "react-responsive-modal";
import "react-responsive-modal/styles.css";
import { APP_CONFIG } from "../../shared/config/appconfig";
import CircleLoading from "../loaders/CircleLoading";
import { enhanceCaption } from "../../shared/services/api";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { postSchema } from "../../schema/forms";
import type z from "zod";
import { tones } from "../../shared/constants/AiTones";

export default function UpdatePost({
  postCaption,
  postImage,
  editFn,
  setShowOptions,
  isLoading,
}: {
  postCaption: string;
  postImage: string | null;
  editFn: (newCaption: string, newImage: File | string) => Promise<void>;
  setShowOptions: (isOpened: boolean) => void;
  isLoading: boolean;
}) {
  const [open, setOpen] = useState(false);
  const [image, setImage] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(postImage);
  const [isPreviewLoading, setIsPreviewLoading] = useState(false);
  const [toneIndex, setToneIndex] = useState(0);
  const [isEnhancing, setIsEnhancing] = useState(false);
  const [caption, setCaption] = useState<string>(postCaption);

  const handleToneChange = () => {
    setToneIndex((t) => (t + 1) % tones.length);
  };

  const handleEnhanceCaption = async () => {
    try {
      setIsEnhancing(true);
      const enhanced = await enhanceCaption(caption.trim(), tones[toneIndex]);
      setCaption(enhanced.trim());
    } catch (err) {
      console.error("Error enhancing caption:", err);
    } finally {
      setIsEnhancing(false);
    }
  };

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<z.infer<typeof postSchema>>({
    resolver: zodResolver(postSchema),
    mode: "all",
    defaultValues: {
      caption: postCaption,
    },
  });

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

  const handleEditPost = async (data: z.infer<typeof postSchema>) => {
    if (image) {
      await editFn(data.caption, image);
    } else {
      await editFn(data.caption, "");
    }

    onModalClose();
  };

  const onModalClose = () => {
    setOpen(false);
    setShowOptions(false);
    reset({ caption: postCaption });
    setImage(null);
    setPreview(postImage);
    setIsPreviewLoading(false);
  };

  useEffect(() => {
    // This runs after the parent component (PostCard) successfully updates its state
    // and passes the new values down as props.
    reset({ caption: postCaption });
    setPreview(postImage);
    setImage(null);
    setCaption(postCaption);
  }, [postCaption, postImage, reset]);

  return (
    <div>
      <button
        className="py-1.5 flex gap-2 justify-center items-center w-full cursor-pointer hover:bg-white/10 transition-colors duration-200"
        onClick={() => setOpen(true)}
      >
        <FontAwesomeIcon icon={faPencilAlt} />
        Edit
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
          <h2 className="text-xl font-semibold mb-3">Update Post</h2>

          <form onSubmit={handleSubmit(handleEditPost)}>
            {/* Caption Input */}
            <div className="flex flex-col">
              <div className="relative">
                <textarea
                  {...register("caption")}
                  value={caption}
                  onChange={(e) => setCaption(e.target.value)}
                  className={`w-full p-3 rounded border-2 text-white outline-none focus:border-blue-400 ${
                    errors.caption
                      ? "border-red-400 focus:border-red-500"
                      : "border-white/20"
                  }`}
                  rows={3}
                  placeholder="Write a caption..."
                />
                {caption.trim().length > 0 && (
                  <>
                    <button
                      type="button"
                      className="absolute text-xs bottom-3 right-17 px-1.5 pr-1 py-1 rounded-full text-white bg-white/10 backdrop-blur-md border border-white/20 transition-all duration-300 cursor-pointer hover:bg-white/20 hover:shadow-lg hover:shadow-white/10 active:scale-95 disabled:opacity-60 disabled:cursor-not-allowed"
                      onClick={handleEnhanceCaption}
                      disabled={isLoading || isEnhancing}
                    >
                      {isEnhancing ? (
                        <div className="flex justify-center items-center gap-1">
                          Enhancing <CircleLoading width="13" height="13" />
                        </div>
                      ) : (
                        "Enhance ✨"
                      )}
                    </button>

                    <button
                      type="button"
                      className="absolute text-xs bottom-3 right-2 px-1.5 py-1 rounded-full text-white bg-white/10 backdrop-blur-md border border-white/20 transition-all duration-300 cursor-pointer hover:bg-white/20 hover:shadow-lg hover:shadow-white/10 active:scale-95 disabled:opacity-60 disabled:cursor-not-allowed"
                      onClick={handleToneChange}
                      disabled={isLoading || isEnhancing}
                    >
                      {tones[toneIndex]}
                    </button>
                  </>
                )}
              </div>
              {errors.caption && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.caption.message}
                </p>
              )}
            </div>

            {/* Image Upload */}

            {isPreviewLoading ? (
              // Loading State while reading file
              <div className="image-upload-div mt-4 flex justify-center items-center border-2 border-dashed border-white/30 rounded-lg py-12">
                <CircleLoading width="32" height="32" />
              </div>
            ) : preview ? (
              <div className="relative text-xs">
                <img
                  src={
                    preview.includes("/posts/")
                      ? `${APP_CONFIG.API_URL}${preview}`
                      : preview
                  }
                  alt="preview"
                  className="mt-3 w-full object-contain max-h-[300px] rounded-lg border border-white/20 shadow-md"
                />
                <label
                  className="absolute h-max w-max top-1.5 right-1.5 cursor-pointer rounded backdrop-blur-lg bg-[#161617b9] flex justify-center items-center p-1 gap-1 outline-1 outline-white opacity-80 hover:opacity-100 transition"
                  htmlFor="image-upload"
                >
                  <FontAwesomeIcon icon={faFilePen} className="text-xs" />
                  Change
                </label>
                <input
                  type="file"
                  id="image-upload"
                  accept="image/*"
                  className="mt-1 hidden"
                  onChange={handleImageChange}
                />
              </div>
            ) : (
              <div className="image-upload-div mt-4">
                <label
                  className="flex justify-center items-center gap-2 border-2 border-dashed border-white/30 rounded-lg mt-4 cursor-pointer hover:border-white/50 transition px-4 py-6 text-white/70 hover:text-white"
                  htmlFor="image-upload"
                >
                  <FontAwesomeIcon icon={faFileImage} className="text-2xl" />
                  Upload Image
                </label>
                <input
                  type="file"
                  id="image-upload"
                  accept="image/*"
                  className="mt-1 hidden"
                  onChange={handleImageChange}
                />
              </div>
            )}

            {/* Buttons */}
            <div className="flex justify-end mt-5 gap-3">
              {/* Cancel */}
              <button
                type="button"
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

              {/* Update */}
              <button
                type="submit"
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
                disabled={isLoading}
              >
                {isLoading ? (
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
