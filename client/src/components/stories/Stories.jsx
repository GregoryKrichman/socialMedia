import "./stories.scss";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { makeRequest } from "../../axios";
import { useAuth } from "../../context/authContext";
import DefaultProfilePic from "../../assets/blank-profile-picture.png";
import { useState, useRef } from "react";

const Stories = () => {
  const { currentUser } = useAuth();
  const queryClient = useQueryClient();
  const [file, setFile] = useState(null);
  const fileInputRef = useRef(null);

  const { isLoading, error, data } = useQuery({
    queryKey: ["stories"],
    queryFn: () => makeRequest.get("/stories").then((res) => res.data),
  });

  const uploadMutation = useMutation({
    mutationFn: (formData) =>
      makeRequest.post("/stories", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      }),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["stories"] }),
  });

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files.length > 0) {
      setFile(e.target.files[0]);
      handleUpload(e.target.files[0]);
    }
  };

  const handlePlusButtonClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleUpload = (selectedFile) => {
    const formData = new FormData();
    formData.append("file", selectedFile);
    formData.append("userId", currentUser.id);
    uploadMutation.mutate(formData);
  };

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error loading stories</div>;

  const stories = Array.isArray(data) ? data.reverse().slice(0, 4) : [];

  return (
    <div className="stories">
      <div className="story">
        <img src={currentUser.profilePic || DefaultProfilePic} alt="Profile" />
        <span>{currentUser.name}</span>
        <input
          type="file"
          style={{ display: "none" }}
          onChange={handleFileChange}
          ref={fileInputRef}
        />
        <button onClick={handlePlusButtonClick}>+</button>
      </div>
      {stories.length > 0 ? (
        stories.map((story) => (
          <div className="story" key={story.id}>
            <img
              src={`https://localhost:8801/uploads/${story.img}`}
              alt="Story"
            />
            <span>{story.name}</span>
          </div>
        ))
      ) : (
        <div>No stories available</div>
      )}
    </div>
  );
};

export default Stories;
