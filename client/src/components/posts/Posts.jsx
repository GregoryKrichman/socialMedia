import { useQuery } from "@tanstack/react-query";
import { makeRequest } from "../../axios";
import Post from "../post/Post";
import "./posts.scss";

const Posts = ({ userId }) => {
  const { isLoading, error, data } = useQuery({
    queryKey: ["posts", userId],
    queryFn: async () => {
      const response = await makeRequest.get(`/posts?userId=${userId}`);
      return response.data;
    },
  });

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error loading posts</div>;

  return (
    <div className="posts">
      {data.map((post) => (
        <Post key={post.id} post={post} />
      ))}
    </div>
  );
};

export default Posts;
