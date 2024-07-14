import React, { useState, useEffect } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { makeRequest } from "../../axios";
import { useAuth } from "../../context/authContext";
import "./post.scss";
import FavoriteBorderOutlinedIcon from "@mui/icons-material/FavoriteBorderOutlined";
import FavoriteOutlinedIcon from "@mui/icons-material/FavoriteOutlined";
import TextsmsOutlinedIcon from "@mui/icons-material/TextsmsOutlined";
import ShareOutlinedIcon from "@mui/icons-material/ShareOutlined";
import MoreHorizIcon from "@mui/icons-material/MoreHoriz";
import { Link } from "react-router-dom";
import Comments from "../comments/Comments";
import moment from "moment";
import DefaultProfilePic from "../../assets/blank-profile-picture.png";

const Post = ({ post, onDelete }) => {
  const [commentOpen, setCommentOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [userData, setUserData] = useState(null);
  const [liked, setLiked] = useState(false);

  const { currentUser } = useAuth();

  const { isLoading, error, data } = useQuery({
    queryKey: ["likes", post?.id],
    queryFn: async () => {
      const response = await makeRequest.get("/likes?postId=" + post?.id);
      return response.data;
    },
    enabled: !!post?.id,
    onSuccess: (data) => {
      setLiked(data.some((like) => like.userId === currentUser.userId));
    },
  });

  const queryClient = useQueryClient();

  const toggleLikeMutation = useMutation({
    mutationFn: async () => {
      const payload = { postId: post?.id, userId: currentUser.userId };
      return await makeRequest.post("/likes/toggle", payload);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["likes", post?.id] });
      setLiked((prev) => !prev);
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (postId) => makeRequest.delete("/posts/" + postId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["posts"] });
      onDelete(post.id);
    },
  });

  const handleLike = () => {
    toggleLikeMutation.mutate();
  };

  const handleDelete = () => {
    if (window.confirm("Are you sure you want to delete this post?")) {
      deleteMutation.mutate(post.id);
    }
  };

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await makeRequest.get(`/users/find/${post.userId}`);
        setUserData(response.data);
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };

    if (post?.userId) {
      fetchUserData();
    }
  }, [post?.userId]);

  if (!post) {
    return <div>Post not found</div>;
  }

  return (
    <div className="post">
      <div className="container">
        <div className="user">
          <div className="userInfo">
            <img
              src={userData?.profilePic || DefaultProfilePic}
              alt="Profile"
            />
            <div className="details">
              <Link
                to={`/profile/${userData?.id}`}
                style={{ textDecoration: "none", color: "inherit" }}
              >
                <span className="name">
                  {userData ? userData.name : "Loading..."}
                </span>
              </Link>
              <span className="date">{moment(post.createdAt).fromNow()}</span>
            </div>
          </div>
          <MoreHorizIcon onClick={() => setMenuOpen(!menuOpen)} />
          {menuOpen && post.user.id === currentUser.userId && (
            <button onClick={handleDelete}>Delete</button>
          )}
        </div>
        <div className="content">
          <p>{post.desc}</p>
          {post.img && (
            <img
              src={`https://localhost:8801/uploads/${post.img}`}
              alt="Post"
            />
          )}
        </div>
        <div className="info">
          <div className="item">
            {isLoading ? (
              "Loading..."
            ) : error ? (
              "Error loading likes"
            ) : (
              <>
                {liked ? (
                  <FavoriteOutlinedIcon
                    style={{ color: "red" }}
                    onClick={handleLike}
                  />
                ) : (
                  <FavoriteBorderOutlinedIcon onClick={handleLike} />
                )}
                {data ? data.length : 0} Likes
              </>
            )}
          </div>
          <div className="item" onClick={() => setCommentOpen(!commentOpen)}>
            <TextsmsOutlinedIcon />
            {post.commentsCount} Comments
          </div>
          <div className="item">
            <ShareOutlinedIcon />
            Share
          </div>
        </div>
        {commentOpen && <Comments postId={post.id} />}
      </div>
    </div>
  );
};

export default Post;
