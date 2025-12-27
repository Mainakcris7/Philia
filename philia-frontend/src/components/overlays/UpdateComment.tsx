import { faPencilAlt } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useEffect, useState } from "react";
import { Modal } from "react-responsive-modal";
import "react-responsive-modal/styles.css";
import CircleLoading from "../loaders/CircleLoading";
import { enhanceCaption } from "../../shared/services/api";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { commentSchema } from "../../schema/forms";
import type z from "zod";
import { tones } from "../../shared/constants/AiTones";

export default function UpdateComment({
  commentContent,
  editFn,
  setShowOptions,
  isLoading,
}: {
  commentContent: string;
  editFn: (newContent: string) => Promise<void>;
  setShowOptions: (isOpened: boolean) => void;
  isLoading: boolean;
}) {
  const [open, setOpen] = useState(false);
  const [toneIndex, setToneIndex] = useState(0);
  const [isEnhancing, setIsEnhancing] = useState(false);
  const [content, setContent] = useState<string>(commentContent);

  const handleToneChange = () => {
    setToneIndex((t) => (t + 1) % tones.length);
  };

  const handleEnhanceComment = async () => {
    try {
      setIsEnhancing(true);
      const enhanced = await enhanceCaption(content.trim(), tones[toneIndex]);
      setContent(enhanced.trim());
    } catch (err) {
      console.error("Error enhancing comment:", err);
    } finally {
      setIsEnhancing(false);
    }
  };

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<z.infer<typeof commentSchema>>({
    resolver: zodResolver(commentSchema),
    mode: "all",
    defaultValues: {
      content: commentContent,
    },
  });

  const handleEditComment = async (data: z.infer<typeof commentSchema>) => {
    await editFn(data.content);
    onModalClose();
  };

  const onModalClose = () => {
    setOpen(false);
    setShowOptions(false);
    reset({ content: commentContent });
    setContent(commentContent);
  };

  useEffect(() => {
    // Reset form when comment content changes
    reset({ content: commentContent });
    setContent(commentContent);
  }, [commentContent, reset]);

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
          <h2 className="text-xl font-semibold mb-3">Update Comment</h2>

          <form onSubmit={handleSubmit(handleEditComment)}>
            {/* Comment Input */}
            <div className="flex flex-col">
              <div className="relative">
                <textarea
                  {...register("content")}
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  className={`w-full p-3 rounded border-2 text-white outline-none focus:border-blue-400 ${
                    errors.content
                      ? "border-red-400 focus:border-red-500"
                      : "border-white/20"
                  }`}
                  rows={3}
                  placeholder="Write your comment..."
                />
                {content.trim().length > 0 && (
                  <>
                    <button
                      type="button"
                      className="absolute text-xs bottom-3 right-17 px-1.5 pr-1 py-1 rounded-full text-white bg-white/10 backdrop-blur-md border border-white/20 transition-all duration-300 cursor-pointer hover:bg-white/20 hover:shadow-lg hover:shadow-white/10 active:scale-95 disabled:opacity-60 disabled:cursor-not-allowed"
                      onClick={handleEnhanceComment}
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
              {errors.content && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.content.message}
                </p>
              )}
            </div>

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
