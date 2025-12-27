import { faCirclePlus, faXmark } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { Modal } from "react-responsive-modal";
import "react-responsive-modal/styles.css";
import { createPost } from "../../shared/services/posts";
import type { Post } from "../../shared/types/post/Post";
import { useDispatch, useSelector } from "react-redux";
import { addUserPost } from "../../redux/slices/user";
import type { RootState } from "../../redux/store/store";
import { faFileImage } from "@fortawesome/free-solid-svg-icons";
import CircleLoading from "../loaders/CircleLoading";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { postSchema } from "../../schema/forms";
import type z from "zod";
import { toast, Bounce } from "react-toastify";
import type { AxiosError } from "axios";
import { enhanceCaption } from "../../shared/services/api";
import { tones } from "../../shared/constants/AiTones";

export default function CreateNewPost() {
  const [open, setOpen] = useState(false);
  const [caption, setCaption] = useState("");
  const [loading, setLoading] = useState(false);
  const [image, setImage] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [toneIndex, setToneIndex] = useState(0);
  // For preview loading
  const [isPreviewLoading, setIsPreviewLoading] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<z.infer<typeof postSchema>>({
    resolver: zodResolver(postSchema),
    mode: "onSubmit",
    defaultValues: {
      caption: "",
    },
  });

  const loggedInUser = useSelector(
    (state: RootState) => state.currentUser.user
  );
  const queryClient = useQueryClient();
  const dispatch = useDispatch();

  const createPostMutation = useMutation({
    mutationFn: async (formData: FormData) => createPost(formData),

    onSuccess: (newPost) => {
      // Update any list cache that may contain this post (home uses ["all-posts"]).
      queryClient.setQueryData<Post[]>(["all-posts"], (old) => {
        if (!old) return [newPost];
        return [newPost, ...old];
      });

      dispatch(addUserPost({ newPost }));
      toast.success("Post created", {
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
    },

    onError: (error) => {
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
    },
  });

  const handleToneChange = () => {
    const nextTone = (toneIndex + 1) % tones.length;
    setToneIndex(nextTone);
  };

  const handleEnhanceCaption = async () => {
    try {
      setLoading(true);
      const enhancedCaption = await enhanceCaption(
        caption.trim(),
        tones[toneIndex]
      );
      setCaption(enhancedCaption.trim());
    } catch (err) {
      console.error("Error enhancing caption:", err);
      return;
    } finally {
      setLoading(false);
    }
  };

  const handleCaptionChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setCaption(e.target.value);
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setImage(file);
    // Start loading
    setIsPreviewLoading(true);

    const reader = new FileReader();
    reader.onloadend = () => {
      setPreview(reader.result as string);
      // Stop loading once the file is read
      setIsPreviewLoading(false);
    };
    reader.readAsDataURL(file);
  };

  const handlePost = async (data: z.infer<typeof postSchema>) => {
    const formData = new FormData();
    formData.append(
      "postData",
      new Blob(
        [
          JSON.stringify({
            userId: loggedInUser?.id,
            caption: data.caption,
          }),
        ],
        { type: "application/json" }
      )
    );
    if (image instanceof File) formData.append("postImage", image);
    await createPostMutation.mutateAsync(formData);
    onModalClose();
  };

  const handleClearImage = () => {
    setImage(null);
    setPreview(null);
  };

  const onModalClose = () => {
    setOpen(false);
    reset({ caption: "" });
    setImage(null);
    setPreview(null);
    // Ensure loading state is reset
    setIsPreviewLoading(false);
  };

  return (
    <div>
      <button
        onClick={() => setOpen(true)}
        className="
        w-[35vw]
        flex justify-center items-center gap-2 
        px-4 py-2 
        rounded
        text-white 
        backdrop-blur-md 
        bg-white/10 
        border border-white/20 
        shadow-md
        hover:bg-white/15 
        hover:shadow-lg
        transition-all duration-200
        cursor-pointer
        mb-4"
      >
        <FontAwesomeIcon icon={faCirclePlus} className="text-xl" />
        Create New Post
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
          <h2 className="text-xl font-semibold mb-3">Create New Post</h2>

          <form onSubmit={handleSubmit(handlePost)}>
            {/* Caption Input */}
            <div className="flex flex-col">
              <div className="caption-input relative">
                <textarea
                  {...register("caption")}
                  onChange={handleCaptionChange}
                  value={caption}
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
                      className="absolute text-xs bottom-3 right-17 px-1.5 pr-1 py-1 rounded-full text-white bg-white/10 backdrop-blur-md border border-white/20
                    transition-all duration-300 cursor-pointer
                    hover:bg-white/20 hover:shadow-lg hover:shadow-white/10
                    active:scale-95 disabled:opacity-60 disabled:cursor-not-allowed"
                      disabled={loading}
                      onClick={handleEnhanceCaption}
                    >
                      {loading ? (
                        <div className="flex justify-center items-center gap-1">
                          Enhancing <CircleLoading width="13" height="13" />
                        </div>
                      ) : (
                        "Enhance ✨"
                      )}
                    </button>
                    <button
                      type="button"
                      className="absolute text-xs bottom-3 right-2 px-1.5 py-1 rounded-full text-white bg-white/10 backdrop-blur-md border border-white/20
                    transition-all duration-300 cursor-pointer
                    hover:bg-white/20 hover:shadow-lg hover:shadow-white/10
                    active:scale-95 disabled:opacity-60 disabled:cursor-not-allowed"
                      onClick={handleToneChange}
                      disabled={loading}
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

            {/* Image Upload / Preview */}

            {isPreviewLoading ? (
              // Loading State while reading file
              <div className="image-upload-div mt-4 flex justify-center items-center border-2 border-dashed border-white/30 rounded-lg py-12">
                <CircleLoading width="32" height="32" />
              </div>
            ) : preview ? (
              // Preview Display
              <div className="relative">
                <img
                  src={preview}
                  alt="preview"
                  className="mt-3 w-full object-contain max-h-[300px] rounded-lg border border-white/20 shadow-md"
                />
                <button
                  type="button"
                  className="absolute top-1.5 right-1.5 cursor-pointer rounded-full backdrop-blur-lg bg-[#ffffff5b] w-5 h-5 flex justify-center items-center text-black font-bold"
                  onClick={handleClearImage}
                >
                  <FontAwesomeIcon icon={faXmark} />
                </button>
              </div>
            ) : (
              // Initial Upload Button
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
                disabled={createPostMutation.isPending}
              >
                Cancel
              </button>

              {/* Post */}
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
                disabled={createPostMutation.isPending}
              >
                {createPostMutation.isPending ? (
                  <>
                    Posting <CircleLoading width="16" height="16" />
                  </>
                ) : (
                  "Post"
                )}
              </button>
            </div>
          </form>
        </div>
      </Modal>
    </div>
  );
}
