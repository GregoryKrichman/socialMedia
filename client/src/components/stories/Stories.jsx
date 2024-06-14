import "./stories.scss";
import { useContext, useRef } from "react";
import { AuthContext } from "../../context/authContext";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { makeRequest } from "../../axios";

const Stories = () => {
  const { currentUser } = useContext(AuthContext);
  const fileInputRef = useRef(null);
  const queryClient = useQueryClient();

  const {
    data: stories,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["stories", currentUser.id],
    queryFn: async () => {
      const response = await makeRequest.get(
        `/stories?userId=${currentUser.id}`
      );
      return response.data;
    },
  });

  const mutation = useMutation({
    mutationFn: async (newStory) => {
      const formData = new FormData();
      formData.append("file", newStory.file);
      const response = await makeRequest.post("/stories", formData);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["stories", currentUser.id] });
    },
  });

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file && stories.length < 4) {
      mutation.mutate({ file });
    }
  };

  const handleButtonClick = () => {
    fileInputRef.current.click();
  };

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error loading stories</div>;

  return (
    <div className="stories">
      {stories.length < 4 && (
        <div className="story">
          <img
            src={
              currentUser.coverPic
                ? `/upload/${currentUser.coverPic}`
                : "default_cover_pic_url"
            }
            alt="Cover"
          />
          <span>{currentUser.name}</span>
          <input
            type="file"
            onChange={handleFileChange}
            style={{ display: "none" }}
            ref={fileInputRef}
          />
          <button onClick={handleButtonClick}>+</button>
        </div>
      )}
      {stories.map((story) => (
        <div className="story" key={story.id}>
          <img src={`/upload/${story.img}`} alt={story.name} />
          <span>{story.name}</span>
        </div>
      ))}
    </div>
  );
};

export default Stories;
