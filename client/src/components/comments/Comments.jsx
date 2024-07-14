import { useState } from "react";
import "./comments.scss";
import { useAuth } from "../../context/authContext";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { makeRequest } from "../../axios";
import moment from "moment";
import DefaultProfilePic from "../../assets/blank-profile-picture.png";

const Comments = ({ postId }) => {
  const { currentUser } = useAuth();

  const { isLoading, error, data } = useQuery({
    queryKey: ["comments", postId],
    queryFn: () =>
      makeRequest.get(`/comments?postId=${postId}`).then((res) => res.data),
  });

  const queryClient = useQueryClient();
  const [desc, setDesc] = useState("");
  const mutation = useMutation({
    mutationFn: (newComment) => makeRequest.post("/comments", newComment),
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: ["comments", postId] }),
  });

  const handleClick = (e) => {
    e.preventDefault();
    if (desc.trim()) {
      const commentData = {
        desc,
        postId,
        userId: currentUser?.userId,
      };
      if (commentData.userId) {
        mutation.mutate(commentData);
        setDesc("");
      } else {
        console.error("User ID is undefined");
      }
    } else {
      alert("Comment cannot be empty");
    }
  };

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error loading comments</div>;

  const comments = Array.isArray(data) ? data : [];

  return (
    <div className="comments">
      <div className="write">
        <img src={currentUser?.profilePic || DefaultProfilePic} alt="Profile" />
        <input
          type="text"
          placeholder="Write a comment"
          value={desc}
          onChange={(e) => setDesc(e.target.value)}
        />
        <button onClick={handleClick}>Send</button>
      </div>
      {comments.length > 0 ? (
        comments.map((comment) => (
          <div className="comment" key={comment.id}>
            <img
              src={comment.userProfilePic || DefaultProfilePic}
              alt="Commenter"
            />
            <div className="info">
              <span>{comment.userName}</span>
              <p>{comment.desc}</p>
            </div>
            <span className="date">{moment(comment.createdAt).fromNow()}</span>
          </div>
        ))
      ) : (
        <div>No comments available</div>
      )}
    </div>
  );
};

export default Comments;
