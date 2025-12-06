import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import type { Post } from "../../shared/types/post/Post";
import {
  faHeart as faHeartFilled,
  faEllipsis,
  faCrown,
} from "@fortawesome/free-solid-svg-icons";
import { faHeart, faComment } from "@fortawesome/free-regular-svg-icons";
import { getTimeElapsed } from "../../shared/utils/AppUtils";
import { useState } from "react";
import { NavLink } from "react-router-dom";
import UpdatePost from "../overlays/UpdatePost";
import DeleteModal from "../overlays/DeleteModal";
import { useDispatch, useSelector } from "react-redux";
import {
  selectUserPostIdSet,
  selectUserLikedPostIdsSet,
} from "../../redux/selectors";
import { APP_CONFIG } from "../../shared/config/appconfig";
import userIcon from "../../assets/user-icon.png";
import {
  deletePostById,
  likePostById,
  removeLikeFromPostById,
  updatePost,
} from "../../shared/services/posts";
import { useQueryClient, useMutation } from "@tanstack/react-query";
import {
  addLikeToPost,
  deleteUserPost,
  editUserPost,
  removeLikeFromPost,
} from "../../redux/slices/user";
import {
  editPostInSearchResult,
  removePostFromSearchResult,
  addLikeToPostInSearchResult,
  removeLikeFromPostInSearchResult,
} from "../../redux/slices/search";
import type { RootState } from "../../redux/store/store";
import LoginOrSignUpModal from "../overlays/LoginOrSignUpModal";
import { toast, Bounce } from "react-toastify";
import type { AxiosError } from "axios";

export default function PostCard({
  post,
  isTrending = false,
  trendingNum = -1,
}: {
  post: Post;
  isTrending?: boolean;
  trendingNum?: number;
}) {
  const loggedInUser = useSelector(
    (state: RootState) => state.currentUser.user
  );
  // const [caption, setCaption] = useState<string>(post.caption);
  // const [image, setImage] = useState<string | null>(post.imageUrl);
  const likedPostIdsSet = useSelector(selectUserLikedPostIdsSet);
  const liked = likedPostIdsSet.has(post.id);

  const [showOptions, setShowOptions] = useState<boolean>(false);

  const queryClient = useQueryClient();
  const dispatch = useDispatch();

  // --- START: CUSTOM TRENDING COLOR LOGIC ---
  let trendingBorderColor = "border-white/20"; // Default border color
  let trendingTextColor = "text-white"; // Default text color

  if (isTrending && trendingNum > 0 && trendingNum <= 3) {
    if (trendingNum === 1) {
      // 🥇 GOLD: Slightly golden background hue and border
      trendingBorderColor = "border-[#FFD700]";
      trendingTextColor = "text-[#FFD700]";
    } else if (trendingNum === 2) {
      // 🥈 SILVER: Slightly silver/light gray background hue and border
      trendingBorderColor = "border-[#C0C0C0]";
      trendingTextColor = "text-[#C0C0C0]";
    } else if (trendingNum === 3) {
      // 🥉 BRONZE: Slightly bronze/brown background hue and border
      trendingBorderColor = "border-[#CD7F32]";
      trendingTextColor = "text-[#CD7F32]";
    }
  }
  const menuVisibilityClasses = showOptions
    ? "opacity-100 translate-x-0 pointer-events-auto" // Final visible state
    : "opacity-0 translate-x-[-10px] pointer-events-none"; // Start 10px higher and fully transparent

  const editMutation = useMutation({
    mutationFn: async (formData: FormData) => updatePost(formData),

    onSuccess: (updatedPost) => {
      // Update only THIS post in the cache
      // Update any list cache that may contain this post (home uses ["all-posts"]).
      // Adding a timestamp to the imageUrl to bust cache
      queryClient.setQueryData<Post[]>(["all-posts"], (old) => {
        if (!old) return old;
        return old.map((p) =>
          p.id === updatedPost.id
            ? {
                ...updatedPost,
                imageUrl: updatedPost.imageUrl
                  ? `${updatedPost.imageUrl}?t=${Date.now()}`
                  : null,
              }
            : p
        );
      });

      // Also update single-post cache if present
      queryClient.setQueryData(["post", updatedPost.id], {
        ...updatedPost,
        imageUrl: updatedPost.imageUrl
          ? `${updatedPost.imageUrl}?t=${Date.now()}`
          : null,
      });

      dispatch(editUserPost({ updatedPost }));
      dispatch(editPostInSearchResult({ updatedPost }));

      toast.success("Post updated", {
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
      console.error("Error updating post:", error);
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

  const deleteMutation = useMutation({
    mutationFn: async () => deletePostById(post.id),

    onSuccess: () => {
      queryClient.setQueryData<Post[]>(["all-posts"], (old) => {
        if (!old) return old;
        return old.filter((p) => p.id !== post.id);
      });

      // Also update single-post cache if present
      queryClient.removeQueries({ queryKey: ["post", post.id] });

      dispatch(deleteUserPost({ postId: post.id }));
      dispatch(removePostFromSearchResult({ postId: post.id }));

      toast.success("Post deleted", {
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
      console.error("Error deleting post:", error);
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

  const likeMutation = useMutation({
    mutationFn: async () => likePostById(post.id, loggedInUser!.id),
    onSuccess: () => {
      // Invalidate queries that may contain this post to refetch updated data
      queryClient.setQueryData<Post[]>(["all-posts"], (old) => {
        if (!old) return old;
        return old.map((p) =>
          p.id === post.id ? { ...p, likesCount: p.likesCount + 1 } : p
        );
      });
      queryClient.invalidateQueries({ queryKey: ["post", post.id] });
      dispatch(addLikeToPostInSearchResult({ postId: post.id }));
    },
    onError: (error) => {
      dispatch(removeLikeFromPost({ postId: post.id }));
      console.error("Error liking post:", error);
    },
  });

  const dislikeMutation = useMutation({
    mutationFn: async () => removeLikeFromPostById(post.id, loggedInUser!.id),
    onSuccess: () => {
      queryClient.setQueryData<Post[]>(["all-posts"], (old) => {
        if (!old) return old;
        return old.map((p) =>
          p.id === post.id ? { ...p, likesCount: p.likesCount - 1 } : p
        );
      });

      queryClient.invalidateQueries({ queryKey: ["post", post.id] });
      dispatch(removeLikeFromPostInSearchResult({ postId: post.id }));
    },
    onError: (error) => {
      dispatch(addLikeToPost({ postId: post.id }));
      console.error("Error unliking post:", error);
    },
  });

  const likePost = async () => {
    dispatch(addLikeToPost({ postId: post.id }));
    likeMutation.mutate();
  };

  const handleDislikePost = async () => {
    dispatch(removeLikeFromPost({ postId: post.id }));
    dislikeMutation.mutate();
  };

  const handleShowOptions = () => {
    setShowOptions(!showOptions);
  };

  const editPost = async (newCaption: string, newImage: File | string) => {
    const formData = new FormData();
    formData.append(
      "postData",
      new Blob(
        [
          JSON.stringify({
            id: post.id,
            caption: newCaption,
          }),
        ],
        { type: "application/json" }
      )
    );
    if (newImage instanceof File) formData.append("postImage", newImage);
    await editMutation.mutateAsync(formData);
    setShowOptions(false);
  };

  const deletePost = async () => {
    await deleteMutation.mutateAsync();
    setShowOptions(false);
  };

  const isCurrentUserPost = useSelector(selectUserPostIdSet).has(post.id);
  return (
    <div
      // Apply dynamic border and background style here
      className={`w-[35vw] relative flex flex-col backdrop-blur-lg border justify-between ${trendingBorderColor} shadow-lg rounded gap-2 transition-all duration-300`}
      style={{ backgroundColor: "rgba(255, 255, 255, 0.1)" }} // 👈 USING DYNAMIC BACKGROUND STYLE
    >
      {/* 👑 CONDITIONAL TRENDING BADGE */}
      {isTrending && trendingNum > 0 && (
        <div
          className={`absolute -top-4 right-[42%] px-3 py-1 rounded-full text-sm font-semibold shadow-xl z-10 ${trendingTextColor} border ${trendingBorderColor}`}
          style={{
            backgroundColor: "rgba(0, 0, 0)",
          }}
        >
          <FontAwesomeIcon icon={faCrown} className="mr-1" />#{trendingNum}
        </div>
      )}
      <div className="top flex p-2 items-center">
        <NavLink
          to={`${APP_CONFIG.API_URL}/users/${post.user.id}`}
          className="hover:underline"
        >
          <img
            src={
              post.user.profileImageUrl
                ? `${APP_CONFIG.API_URL}${post.user.profileImageUrl}`
                : userIcon
            }
            alt={`${post.user.firstName} ${post.user.lastName}`}
            className="w-15 h-15 rounded-full mr-4 outline-1 bg-gray-800 object-contain"
          />
        </NavLink>
        <div className="name-date flex flex-col">
          <NavLink to={`/users/${post.user.id}`} className="hover:underline">
            <span className="font-semibold text-[1rem]">
              {post.user.firstName} {post.user.lastName}
            </span>
          </NavLink>
          <span className="text-sm text-gray-400">
            {getTimeElapsed(post.createdAt)}
          </span>
        </div>
        {isCurrentUserPost && (
          <div className="ml-auto relative cursor-pointer bottom-2 text-white">
            <button
              className="rounded-full relative -top-1 px-0.5 left-0.5 cursor-pointer z-50 hover:bg-white/10 transition-colors duration-200"
              onClick={handleShowOptions}
            >
              <FontAwesomeIcon icon={faEllipsis} className="text-md" />
            </button>
            <div
              className={`w-[100px] text-sm absolute left-10 -top-5 flex flex-col backdrop-blur-sm
                         bg-white/10 rounded-md border border-white/20 shadow-2xl overflow-hidden
                         origin-top-right transition-all duration-100 ease-out ${menuVisibilityClasses}`}
            >
              {/* <button
                className="py-1.5 flex gap-2 justify-center items-center w-full cursor-pointer hover:bg-white/10 transition-colors duration-200"
                onClick={editPost}
              >
                <FontAwesomeIcon icon={faPencilAlt} />
                Edit
              </button> */}
              <UpdatePost
                postCaption={post.caption}
                postImage={post.imageUrl}
                editFn={editPost}
                setShowOptions={setShowOptions}
                isLoading={editMutation.isPending}
              />
              {/* <button
                className="py-1.5 flex gap-2 justify-center items-center w-full cursor-pointer hover:bg-white/10 transition-colors duration-200"
                onClick={deletePost}
              >
                <FontAwesomeIcon icon={faTrashAlt} />
                Delete
              </button> */}
              <DeleteModal
                deleteFn={deletePost}
                setShowOptions={setShowOptions}
                text={`Do you really want to delete the post?`}
                isLoading={deleteMutation.isPending}
              />
            </div>
          </div>
        )}
      </div>
      <NavLink to={`/posts/${post.id}`}>
        <div className="flex-1 px-2">
          <p className="text-md">{post.caption}</p>
        </div>
      </NavLink>
      <NavLink to={`/posts/${post.id}`}>
        <div>
          {post.imageUrl && (
            <img
              src={`${APP_CONFIG.API_URL}${post.imageUrl}`}
              alt={post.caption}
              className="w-full max-h-[400px] object-contain bg-gray-900"
            />
          )}
        </div>
      </NavLink>
      <div className="like-comment flex flex-col justify-between">
        <NavLink to={`/posts/${post.id}`}>
          <div className="top px-2 flex justify-between mb-2">
            <div className="like-cnt flex gap-1 items-center">
              <FontAwesomeIcon
                icon={faHeartFilled}
                className="text-sm"
                color="#F91880"
              />
              <span className="text-sm text-gray-300">
                {post.likesCount} likes
              </span>
            </div>
            <div className="comment-cnt flex gap-1 items-center">
              <span className="text-sm text-gray-300">
                {post.commentsCount} comments
              </span>
            </div>
          </div>
        </NavLink>
        <div className="btns flex justify-between">
          {/* If user is logged in show like button else show login modal */}
          {loggedInUser ? (
            <button
              className={`rounded-bl border border-white/20 flex gap-2 justify-center items-center flex-1 py-2 cursor-pointer hover:bg-[#ffffff1b] transition-all duration-200`}
              onClick={liked ? handleDislikePost : likePost}
            >
              <FontAwesomeIcon
                icon={liked ? faHeartFilled : faHeart}
                className={`text-lg ${liked ? "text-[#F91880]" : ""}`}
              />
              <span className="text-md">{liked ? "Liked" : "Like"}</span>
            </button>
          ) : (
            <LoginOrSignUpModal
              btnClasses="rounded-bl border border-white/20 flex gap-2 justify-center items-center flex-1 py-2 cursor-pointer hover:bg-[#ffffff1b] transition-all duration-200"
              text="Like"
            />
          )}
          <NavLink
            to={`/posts/${post.id}`}
            className="rounded-br border border-white/20 flex gap-2 justify-center items-center flex-1 py-2 cursor-pointer hover:bg-[#ffffff1b] transition-all duration-200"
          >
            <FontAwesomeIcon icon={faComment} className="text-lg" />
            <span className="text-md">Comment</span>
          </NavLink>
        </div>
      </div>
    </div>
  );
}
