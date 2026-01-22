import { Post } from "../type";

interface Props {
  post: Post;
}

const Body = ({post}: Props) => {
  return (
    <div className="post-body">
      {post.body}
    </div>
  )
}

export default Body;
