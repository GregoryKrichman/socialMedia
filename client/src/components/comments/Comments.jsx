import { useContext, useState } from "react";
import "./comments.scss";
import { AuthContext } from "../../context/authContext";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { makeRequest } from "../../axios";
import moment from "moment";
import DefaultProfilePic from "../../assets/blank-profile-picture.png";

const Comments = ({ postId }) => {
  const { currentUser } = useContext(AuthContext);

  const { isLoading, error, data } = useQuery({
    queryKey: ["comments", postId],
    queryFn: () =>
      makeRequest.get(`/comments?postId=${postId}`).then((res) => res.data),
  });

  const queryClient = useQueryClient();
  const [desc, setDesc] = useState("");
  const mutation = useMutation({
    mutationFn: (newComment) => {
      return makeRequest.post("/comments", newComment);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["comments", postId] });
    },
  });

  const handleClick = async (e) => {
    e.preventDefault();
    mutation.mutate({ desc, postId });
    setDesc("");
  };

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error loading comments</div>;

  return (
    <div className="comments">
      <div className="write">
        <img
          src={
            currentUser.profilePic
              ? `/upload/${currentUser.profilePic}`
              : DefaultProfilePic
          }
          alt=""
        />
        <input
          type="text"
          placeholder="Write a comment"
          value={desc}
          onChange={(e) => setDesc(e.target.value)}
        />
        <button onClick={handleClick}>Send</button>
      </div>
      {data && data.length > 0 ? (
        data.map((comment) => (
          <div className="comment" key={comment.id}>
            <img src={`/upload/${comment.profilePic}`} alt="" />
            <div className="info">
              <span>{comment.name}</span>
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
