import { NavLink } from "react-router-dom";
import type { Comment } from "../../shared/types/comment/Comment";
import { getTimeElapsed } from "../../shared/utils/AppUtils";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faEllipsis,
  faHeart as faHeartFilled,
} from "@fortawesome/free-solid-svg-icons";
import { faHeart } from "@fortawesome/free-regular-svg-icons";
import { useState } from "react";
import UpdateComment from "../overlays/UpdateComment";
import DeleteModal from "../overlays/DeleteModal";
import { useDispatch, useSelector } from "react-redux";
import {
  selectUserCommentIdSet,
  selectUserLikedCommentIdsSet,
} from "../../redux/selectors";
import { APP_CONFIG } from "../../shared/config/appconfig";
import userIcon from "../../assets/user-icon.png";
import {
  deleteCommentById,
  likeCommentById,
  removeLikeFromCommentById,
  updateComment,
} from "../../shared/services/comments";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  addLikeToComment,
  removeCommentId,
  removeLikeFromComment,
} from "../../redux/slices/user";
import type { CommentUpdate } from "../../shared/types/comment/CommentUpdate";
import type { RootState } from "../../redux/store/store";
import LoginOrSignUpModal from "../overlays/LoginOrSignUpModal";
import type { Post } from "../../shared/types/post/Post";

export default function CommentCard({ comment }: { comment: Comment }) {
  const loggedInUser = useSelector(
    (state: RootState) => state.currentUser.user
  );
  // const [likes, setLikes] = useState(comment.likesCount);
  const likedCommentsSet = useSelector(selectUserLikedCommentIdsSet);
  console.log("Liked Comments Set:", likedCommentsSet);
  const liked = likedCommentsSet.has(comment.id);
  const [showOptions, setShowOptions] = useState<boolean>(false);

  const menuVisibilityClasses = showOptions
    ? "opacity-100 translate-x-0 pointer-events-auto" // Final visible state
    : "opacity-0 translate-x-[-10px] pointer-events-none"; // Start 10px higher and fully transparent
  // const isCurrentUserPost = Math.random() > 0.01;

  const isCurrentUserComment = useSelector(selectUserCommentIdSet).has(
    comment.id
  );

  const queryClient = useQueryClient();
  const dispatch = useDispatch();

  const editCommentMutation = useMutation({
    mutationFn: async (data: CommentUpdate) => updateComment(data),

    onSuccess: (updatedComment) => {
      queryClient.setQueryData<Comment[]>(
        ["post-comments", comment.postId],
        (old) => {
          if (!old) return old;
          return old.map((c) =>
            c.id === updatedComment.id ? updatedComment : c
          );
        }
      );
    },

    onError: (error) => {
      console.error("Error updating post:", error);
    },
  });

  const deleteCommentMutation = useMutation({
    mutationFn: async () => deleteCommentById(comment.id),

    onSuccess: () => {
      queryClient.setQueryData<Comment[]>(
        ["post-comments", comment.postId],
        (old) => {
          if (!old) return old;
          return old.filter((c) => c.id !== comment.id);
        }
      );
      queryClient.invalidateQueries({ queryKey: ["post", comment.postId] });
      // queryClient.invalidateQueries({ queryKey: ["all-posts"] });
      queryClient.setQueryData<Post[]>(["all-posts"], (oldPosts) => {
        if (!oldPosts) return oldPosts;
        return oldPosts.map((post) => {
          if (post.id === comment.postId) {
            return { ...post, commentsCount: post.commentsCount - 1 };
          }
          return post;
        });
      });

      dispatch(removeCommentId({ commentId: comment.id }));
    },

    onError: (error) => {
      console.error("Error deleting comment:", error);
    },
  });

  const likeMutation = useMutation({
    mutationFn: async () => likeCommentById(comment.id, loggedInUser!.id),
    onSuccess: () => {
      queryClient.setQueryData<Comment[]>(
        ["post-comments", comment.postId],
        (old) => {
          if (!old) return old;
          return old.map((c) =>
            c.id === comment.id ? { ...c, likesCount: c.likesCount + 1 } : c
          );
        }
      );
    },
    onError: (error) => {
      dispatch(removeLikeFromComment({ commentId: comment.id }));
      console.error("Error liking comment:", error);
    },
  });

  const dislikeMutation = useMutation({
    mutationFn: async () =>
      removeLikeFromCommentById(comment.id, loggedInUser!.id),
    onSuccess: () => {
      queryClient.setQueryData<Comment[]>(
        ["post-comments", comment.postId],
        (old) => {
          if (!old) return old;
          return old.map((c) =>
            c.id === comment.id ? { ...c, likesCount: c.likesCount - 1 } : c
          );
        }
      );
    },
    onError: (error) => {
      dispatch(addLikeToComment({ commentId: comment.id }));
      console.error("Error liking comment:", error);
    },
  });

  const handleShowOptions = () => {
    setShowOptions(!showOptions);
  };

  const editComment = async (newContent: string) => {
    const updatedCommentData: CommentUpdate = {
      id: comment.id,
      content: newContent,
    };
    await editCommentMutation.mutateAsync(updatedCommentData);
    setShowOptions(false);
  };

  const deleteComment = async () => {
    await deleteCommentMutation.mutateAsync();
    setShowOptions(false);
  };

  const likeComment = async () => {
    dispatch(addLikeToComment({ commentId: comment.id }));
    likeMutation.mutate();
  };

  const dislikeComment = async () => {
    dispatch(removeLikeFromComment({ commentId: comment.id }));
    dislikeMutation.mutate();
  };
  return (
    <div
      className={`comment w-[35vw] relative flex flex-col backdrop-blur-lg border justify-evenly border-white/20 shadow-lg rounded gap-0.5 transition-all duration-300`}
      style={{ backgroundColor: "rgba(255, 255, 255, 0.1)" }}
    >
      <div className="top flex pt-2 px-2 items-center">
        <NavLink to={`/users/${comment.user.id}`} className="hover:underline">
          <img
            src={
              comment.user.profileImageUrl
                ? `${APP_CONFIG.API_URL}${comment.user.profileImageUrl}`
                : userIcon
            }
            alt={`${comment.user.firstName} ${comment.user.lastName}`}
            className="w-12 h-12 rounded-full mr-4"
          />
        </NavLink>
        <div className="name-date flex flex-col">
          <NavLink to={`/users/${comment.user.id}`} className="hover:underline">
            <span className="font-semibold text-sm">
              {comment.user.firstName} {comment.user.lastName}
            </span>
          </NavLink>
          <span className="text-xs text-gray-400 relative">
            {getTimeElapsed(comment.createdAt)}
          </span>
          {isCurrentUserComment && (
            <div className="ml-auto cursor-pointer absolute right-2 top-0 bottom-2 text-white">
              <button
                className="rounded-full relative top-0.5 px-0.5 left-0.5 cursor-pointer z-50 hover:bg-white/10 transition-colors duration-200"
                onClick={handleShowOptions}
              >
                <FontAwesomeIcon icon={faEllipsis} className="text-md" />
              </button>
              <div
                className={`w-[100px] text-sm absolute left-9 top-0 flex flex-col backdrop-blur-sm
                                   bg-white/10 rounded-md border border-white/20 shadow-2xl overflow-hidden
                                   origin-top-right transition-all duration-100 ease-out ${menuVisibilityClasses}`}
              >
                <UpdateComment
                  commentContent={comment.content}
                  editFn={editComment}
                  setShowOptions={setShowOptions}
                  isLoading={editCommentMutation.isPending}
                />
                <DeleteModal
                  deleteFn={deleteComment}
                  setShowOptions={setShowOptions}
                  text={`Do you really want to delete the comment?`}
                  isLoading={deleteCommentMutation.isPending}
                />
              </div>
            </div>
          )}
        </div>
      </div>
      <div className="flex-1 p-2">
        <p className="text-[0.9rem]">{comment.content}</p>
      </div>
      <div className="bottom w-full flex justify-between absolute -bottom-6 px-3">
        <div className="like-cnt flex gap-1 items-center">
          <FontAwesomeIcon
            icon={faHeartFilled}
            className="text-sm"
            color="#F91880"
          />
          <span className="text-sm text-gray-300">{comment.likesCount}</span>
        </div>
        <div className="like flex gap-1 items-center">
          {loggedInUser ? (
            <button
              className="cursor-pointer"
              onClick={liked ? dislikeComment : likeComment}
            >
              <FontAwesomeIcon
                icon={liked ? faHeartFilled : faHeart}
                className={` hover:text-[#F91880] text-sm transition-all duration-200 ${
                  liked ? "text-[#F91880]" : ""
                }`}
              />
            </button>
          ) : (
            <LoginOrSignUpModal btnClasses="text-sm cursor-pointer" />
          )}
        </div>
      </div>
    </div>
  );
}
