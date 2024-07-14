import { useQuery } from "@tanstack/react-query";
import { makeRequest } from "../../axios";
import Post from "../post/Post";
import "./posts.scss";

const Posts = ({ userId }) => {
  const { isLoading, error, data } = useQuery({
    queryKey: ["posts"],
    queryFn: async () => {
      const response = await makeRequest.get("/posts");
      return response.data;
    },
  });

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error loading posts</div>;

  const posts = Array.isArray(data) ? data : [];

  // Filter posts based on the userId prop
  const filteredPosts = userId
    ? posts.filter((post) => post.userId === userId)
    : posts;

  return (
    <div className="posts">
      {filteredPosts.length > 0 ? (
        filteredPosts.map((post) => <Post key={post.id} post={post} />)
      ) : (
        <div>No posts available</div>
      )}
    </div>
  );
};

export default Posts;
