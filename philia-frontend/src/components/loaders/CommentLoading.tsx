import { Comment } from "react-loader-spinner";

export default function CommentLoading({
  width,
  height,
}: {
  width?: string;
  height?: string;
}) {
  return (
    <Comment
      visible={true}
      height={height || "80"}
      width={width || "80"}
      ariaLabel="comment-loading"
      wrapperStyle={{}}
      wrapperClass="comment-wrapper"
      color="#7d7ffa"
      backgroundColor="white"
    />
  );
}
