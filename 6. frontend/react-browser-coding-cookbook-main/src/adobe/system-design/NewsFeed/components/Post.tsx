import Header from "./Header";
import { Post as PostType, PostState } from "../type"
import Body from "./Body";
import { RefObject, useEffect } from "react";

interface PostProps {
  post: PostType
  isLastPost: boolean;
  ref: RefObject<HTMLDivElement | null>;
}

const Post = ({post, ref, isLastPost}: PostProps) => {

  return (
    <div ref={isLastPost ? ref : null} className="post-container">
      <Header userId={post.userId} />
      <Body post={post} />
    </div>
  )
}

export default Post;
