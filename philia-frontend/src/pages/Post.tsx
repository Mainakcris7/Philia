import { useParams } from "react-router-dom";
import PostCard from "../components/cards/PostCard";
import CommentCard from "../components/cards/CommentCard";
import CommentInput from "../components/cards/CommentInput";
import { getCommentsByPostId, getPostById } from "../shared/services/posts";
import { useQuery } from "@tanstack/react-query";
import type { RootState } from "../redux/store/store";
import { useSelector } from "react-redux";
import CommentLoading from "../components/loaders/CommentLoading";
import GridLoading from "../components/loaders/GridLoading";

export default function Post() {
  const { postId } = useParams();
  const id = Number(postId);
  const loggedInUser = useSelector(
    (state: RootState) => state.currentUser.user
  );

  const {
    data: post,
    isLoading: isPostLoading,
    error: postError,
  } = useQuery({
    queryKey: ["post", id],
    queryFn: () => getPostById(id),
    staleTime: 5 * 60 * 1000,
  });

  const {
    data: comments = [],
    isLoading: isCommentsLoading,
    error: commentsError,
  } = useQuery({
    queryKey: ["post-comments", id],
    queryFn: () => getCommentsByPostId(id),
    staleTime: 5 * 60 * 1000,
  });

  if (postError) throw postError;
  if (commentsError) throw commentsError;

  return (
    <div className="flex flex-col items-center mb-25">
      <div className="post">
        {isPostLoading ? (
          <div className="min-h-[80vh] text-xl flex flex-col gap-2 justify-center items-center">
            <GridLoading />
            <p>Loading post</p>
          </div>
        ) : post ? (
          <PostCard post={post} />
        ) : (
          <p className="text-xl text-gray-400 font-semibold">Post not found!</p>
        )}
      </div>

      <div className="comments mt-4">
        {isCommentsLoading ? (
          <div className="flex items-center justify-center gap-2 text-xl text-gray-400 font-semibold">
            Loading comments <CommentLoading width="20" height="20" />
          </div>
        ) : comments && comments.length > 0 ? (
          <>
            <h1 className="font-semibold text-2xl text-center">Comments</h1>
            <div className="comments mt-2 flex flex-col gap-8 mb-12">
              {comments.map((comment) => (
                <CommentCard key={comment.id} comment={comment} />
              ))}
            </div>
          </>
        ) : (
          <p className="text-xl text-gray-400 font-semibold mb-5 ">
            {post && loggedInUser && `Be the first to comment on this post!`}
          </p>
        )}
      </div>

      {post && loggedInUser && <CommentInput postId={post.id} />}
    </div>
  );
}
