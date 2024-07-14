import React, { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { makeRequest } from "../../axios";
import { useAuth } from "../../context/authContext";
import Image from "../../assets/img.png";
import Map from "../../assets/map.png";
import Friend from "../../assets/friend.png";
import DefaultProfilePic from "../../assets/blank-profile-picture.png";
import "./share.scss";

const Share = () => {
  const [file, setFile] = useState(null);
  const [desc, setDesc] = useState("");
  const { currentUser, isLoading } = useAuth();
  const queryClient = useQueryClient();

  const upload = async () => {
    try {
      const formData = new FormData();
      formData.append("file", file);
      const res = await makeRequest.post("/upload", formData);
      return res.data.filename;
    } catch (err) {
      console.error("Error uploading file:", err);
      throw err;
    }
  };

  const mutation = useMutation({
    mutationFn: (newPost) => makeRequest.post("/posts", newPost),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["posts"] }),
    onError: (error) =>
      console.error(
        "Error posting new post:",
        error.response ? error.response.data : error.message
      ),
  });

  const handleClick = async (e) => {
    e.preventDefault();
    try {
      let imgUrl = "";
      if (file) imgUrl = await upload();
      const postData = {
        desc,
        img: imgUrl,
        content: desc,
        userId: currentUser?.userId,
      };
      if (postData.userId) {
        mutation.mutate(postData);
        setDesc("");
        setFile(null);
      } else {
        console.error("User ID is undefined");
      }
    } catch (err) {
      console.error("Error preparing post data:", err);
    }
  };

  return (
    <div className="share">
      <div className="container">
        <div className="top">
          <div className="left">
            <img
              src={currentUser?.profilePic || DefaultProfilePic}
              alt="Profile"
            />
            <input
              type="text"
              placeholder={
                isLoading
                  ? "Loading..."
                  : `What's on your mind ${currentUser?.name}?`
              }
              onChange={(e) => setDesc(e.target.value)}
              value={desc}
            />
          </div>
          <div className="right">
            {file && (
              <img className="file" alt="" src={URL.createObjectURL(file)} />
            )}
          </div>
        </div>
        <hr />
        <div className="bottom">
          <div className="left">
            <input
              type="file"
              id="file"
              style={{ display: "none" }}
              onChange={(e) => setFile(e.target.files[0])}
            />
            <label htmlFor="file">
              <div className="item">
                <img src={Image} alt="Add" />
                <span>Add Image</span>
              </div>
            </label>
            <div className="item">
              <img src={Map} alt="Add" />
              <span>Add Place</span>
            </div>
            <div className="item">
              <img src={Friend} alt="Add" />
              <span>Tag Friends</span>
            </div>
          </div>
          <div className="right">
            <button onClick={handleClick} disabled={isLoading}>
              Share
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Share;
