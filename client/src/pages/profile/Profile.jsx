import "./profile.scss";
import FacebookTwoToneIcon from "@mui/icons-material/FacebookTwoTone";
import LinkedInIcon from "@mui/icons-material/LinkedIn";
import InstagramIcon from "@mui/icons-material/Instagram";
import PinterestIcon from "@mui/icons-material/Pinterest";
import TwitterIcon from "@mui/icons-material/Twitter";
import PlaceIcon from "@mui/icons-material/Place";
import LanguageIcon from "@mui/icons-material/Language";
import EmailOutlinedIcon from "@mui/icons-material/EmailOutlined";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import Posts from "../../components/posts/Posts";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { makeRequest } from "../../axios";
import { useLocation } from "react-router-dom";
import { useContext, useState } from "react";
import { AuthContext } from "../../context/authContext";
import Update from "../../components/update/Update";

const Profile = () => {
  const [openUpdate, setOpenUpdate] = useState(false);
  const { currentUser, setCurrentUser } = useContext(AuthContext);
  const userId = parseInt(useLocation().pathname.split("/")[2]);

  const {
    isLoading: userLoading,
    error,
    data,
  } = useQuery({
    queryKey: ["user", userId],
    queryFn: async () => {
      const response = await makeRequest.get("/users/find/" + userId);
      return response.data;
    },
  });

  const {
    isLoading: relationshipLoading,
    data: relationshipData,
    error: relationshipError,
  } = useQuery({
    queryKey: ["relationship", userId],
    queryFn: async () => {
      const response = await makeRequest.get(
        "/relationships?followedUserId=" + userId
      );
      return response.data;
    },
  });

  const queryClient = useQueryClient();
  const mutation = useMutation({
    mutationFn: (following) => {
      if (following)
        return makeRequest.delete("/relationships?userId=" + userId);
      return makeRequest.post("/relationships", { userId });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["relationship"] });
    },
  });

  const handleFollow = () => {
    if (relationshipData) {
      mutation.mutate(relationshipData.includes(currentUser.id));
    }
  };

  const handleUpdate = (updatedUser) => {
    setCurrentUser(updatedUser);
    setOpenUpdate(false);
    queryClient.invalidateQueries({ queryKey: ["user", userId] });
  };

  if (userLoading || relationshipLoading) return <div>Loading...</div>;
  if (error || relationshipError) return <div>Error loading profile</div>;

  return (
    <div className="profile">
      <div className="images">
        <img
          src={
            data.coverPic ? `/upload/${data.coverPic}` : "default_cover_pic_url"
          }
          alt=""
          className="cover"
        />
        <img
          src={
            data.profilePic
              ? `/upload/${data.profilePic}`
              : "default_profile_pic_url"
          }
          alt=""
          className="profilePic"
        />
      </div>
      <div className="profileContainer">
        <div className="uInfo">
          <div className="left">
            <a href="http://facebook.com">
              <FacebookTwoToneIcon fontSize="large" />
            </a>
            <a href="http://instagram.com">
              <InstagramIcon fontSize="large" />
            </a>
            <a href="http://twitter.com">
              <TwitterIcon fontSize="large" />
            </a>
            <a href="http://linkedin.com">
              <LinkedInIcon fontSize="large" />
            </a>
            <a href="http://pinterest.com">
              <PinterestIcon fontSize="large" />
            </a>
          </div>
          <div className="center">
            <span>{data?.name}</span>
            <div className="info">
              <div className="item">
                <PlaceIcon />
                <span>{data?.city}</span>
              </div>
              <div className="item">
                <LanguageIcon />
                <span>{data?.website}</span>
              </div>
            </div>
            {userId === currentUser.id ? (
              <button onClick={() => setOpenUpdate(true)}>update</button>
            ) : (
              <button onClick={handleFollow}>
                {relationshipData && relationshipData.includes(currentUser.id)
                  ? "Following"
                  : "Follow"}
              </button>
            )}
          </div>
          <div className="right">
            <EmailOutlinedIcon />
            <MoreVertIcon />
          </div>
        </div>
        <Posts userId={userId} />
      </div>
      {openUpdate && (
        <Update
          setOpenUpdate={setOpenUpdate}
          user={data}
          onUpdate={handleUpdate}
        />
      )}
    </div>
  );
};

export default Profile;
