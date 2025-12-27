import { faPaperPlane } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useState } from "react";
import type { Comment } from "../../shared/types/comment/Comment";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { addCommentId } from "../../redux/slices/user";
import { addCommentToPost } from "../../shared/services/comments";
import type { CommentCreate } from "../../shared/types/comment/CommentCreate";
import { useDispatch, useSelector } from "react-redux";
import type { RootState } from "../../redux/store/store";
import type { Post } from "../../shared/types/post/Post";
import CircleLoading from "../loaders/CircleLoading";
import { enhanceCaption } from "../../shared/services/api";
import { tones } from "../../shared/constants/AiTones";

export default function CommentInput({ postId }: { postId: number }) {
  const [comment, setComment] = useState<string>("");
  const [toneIndex, setToneIndex] = useState(0);
  const [isEnhancing, setIsEnhancing] = useState(false);
  const handleCommentInput = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setComment(e.target.value);
  };
  const loggedInUser = useSelector(
    (state: RootState) => state.currentUser.user
  );
  const dispatch = useDispatch();
  const queryClient = useQueryClient();

  const createCommentMutation = useMutation({
    mutationFn: async (newCommentData: CommentCreate) =>
      addCommentToPost(newCommentData),

    onSuccess: (newComment) => {
      queryClient.setQueryData<Comment[]>(["post-comments", postId], (old) => {
        if (!old) return [newComment];
        return [newComment, ...old];
      });
      queryClient.invalidateQueries({ queryKey: ["post", postId] });
      // queryClient.invalidateQueries({ queryKey: ["all-posts"] });

      queryClient.setQueryData<Post[]>(["all-posts"], (oldPosts) => {
        if (!oldPosts) return oldPosts;
        return oldPosts.map((post) => {
          if (post.id === postId) {
            return { ...post, commentsCount: post.commentsCount + 1 };
          }
          return post;
        });
      });

      dispatch(addCommentId({ newCommentId: newComment.id }));
    },

    onError: (error) => {
      console.error("Error updating comment:", error);
    },
  });

  const handleAddComment = async () => {
    if (comment.trim().length == 0) return;
    const newComment: CommentCreate = {
      userId: loggedInUser!.id,
      postId: postId,
      content: comment.trim(),
    };
    createCommentMutation.mutate(newComment);
    setComment("");
  };

  const handleToneChange = () => {
    const nextTone = (toneIndex + 1) % tones.length;
    setToneIndex(nextTone);
  };

  const handleEnhanceComment = async () => {
    try {
      setIsEnhancing(true);
      const enhanced = await enhanceCaption(comment.trim(), tones[toneIndex]);
      setComment(enhanced.trim());
    } catch (err) {
      console.error("Error enhancing comment:", err);
    } finally {
      setIsEnhancing(false);
    }
  };
  return (
    <div
      className="w-screen flex justify-center p-3 fixed bottom-0 backdrop-blur-lg border shadow-lg rounded gap-2 transition-all duration-300 border-white/20"
      style={{ backgroundColor: "rgba(255, 255, 255, 0.1)" }}
    >
      <div className="text-area-dev relative">
        <textarea
          id="comment-input"
          className="w-[35vw] text-md rounded border-2 h-20 border-blue-200 focus:border-blue-400 outline-0 px-2 pr-10 py-2 resize-none"
          placeholder="Enter your thoughts here..."
          value={comment}
          onChange={handleCommentInput}
        ></textarea>
        {comment.trim().length > 0 && (
          <>
            <button
              type="button"
              className="absolute text-xs bottom-3 right-10 px-1.5 py-1 rounded-full text-white bg-white/10 backdrop-blur-md border border-white/20 transition-all duration-300 cursor-pointer hover:bg-white/20 hover:shadow-lg hover:shadow-white/10 active:scale-95 disabled:opacity-60 disabled:cursor-not-allowed"
              onClick={handleToneChange}
              disabled={createCommentMutation.isPending || isEnhancing}
            >
              {tones[toneIndex]}
            </button>
            <button
              type="button"
              className="absolute text-sm bottom-3 right-1.5 px-1.5 pr-1 py-1 rounded-full text-white bg-white/10 backdrop-blur-md border border-white/20 transition-all duration-300 cursor-pointer hover:bg-white/20 hover:shadow-lg hover:shadow-white/10 active:scale-95 disabled:opacity-60 disabled:cursor-not-allowed"
              onClick={handleEnhanceComment}
              disabled={createCommentMutation.isPending || isEnhancing}
            >
              {isEnhancing ? (
                <div className="flex justify-center items-center gap-1">
                  <CircleLoading width="16" height="16" />
                </div>
              ) : (
                "✨"
              )}
            </button>
          </>
        )}
        <button
          className="backdrop-blur-lg absolute top-1.5 right-1.5 h-max px-1.5 py-2 flex justify-center items-center rounded-full bg-[#2b5cac25] disabled:opacity-60 disabled:cursor-not-allowed"
          disabled={
            comment.trim().length == 0 || createCommentMutation.isPending
          }
          onClick={handleAddComment}
        >
          {createCommentMutation.isPending ? (
            <CircleLoading width="18" height="18" />
          ) : (
            <FontAwesomeIcon
              icon={faPaperPlane}
              className="cursor-pointer text-md rotate-43 -translate-x-0.5"
            />
          )}
        </button>
      </div>
    </div>
  );
}
