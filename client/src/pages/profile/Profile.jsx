import { useState, useEffect } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { makeRequest } from "../../axios";
import { useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/authContext";
import Posts from "../../components/posts/Posts";
import Update from "../../components/update/Update";
import EditProfileForm from "../../components/editProfileForm/EditProfileForm";
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
import DefaultProfilePic from "../../assets/blank-profile-picture.png";

const Profile = () => {
  const [openUpdate, setOpenUpdate] = useState(false);
  const [openEditProfile, setOpenEditProfile] = useState(false);
  const { currentUser, setCurrentUser } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [userId, setUserId] = useState(null);
  const [isFollowing, setIsFollowing] = useState(false);
  const queryClient = useQueryClient();

  useEffect(() => {
    const pathParts = location.pathname.split("/");
    const extractedUserId = parseInt(pathParts[2], 10);

    if (isNaN(extractedUserId)) {
      navigate("/error");
    } else {
      setUserId(extractedUserId);
    }
  }, [location.pathname, navigate]);

  useQuery({
    queryKey: ["user", userId],
    queryFn: async () => {
      const response = await makeRequest.get(`/users/find/${userId}`);
      return response.data;
    },
    enabled: userId !== null,
    onSuccess: (data) => {
      setCurrentUser(data);
    },
  });

  useQuery({
    queryKey: ["relationship", userId],
    queryFn: async () => {
      const response = await makeRequest.get(
        `/relationships?followedUserId=${userId}`
      );
      return response.data;
    },
    enabled: userId !== null,
    onSuccess: (data) => {
      const isFollowing = data.some(
        (relationship) => relationship.FollowerUserId === currentUser.userId
      );
      setIsFollowing(isFollowing);
    },
  });

  const mutation = useMutation({
    mutationFn: async (following) => {
      const payload = {
        FollowerUserId: currentUser.userId,
        FollowedUserId: userId,
      };
      console.log("Payload:", payload);
      if (following) {
        return await makeRequest.delete(`/relationships`, { data: payload });
      } else {
        return await makeRequest.post("/relationships", payload);
      }
    },
    onSuccess: () => {
      console.log("Mutation successful");
      queryClient.invalidateQueries(["relationship", userId]);
    },
    onError: (error) => {
      console.error("Error following/unfollowing user:", error);
    },
  });

  const handleFollow = () => {
    mutation.mutate(isFollowing);
    setIsFollowing(!isFollowing);
  };

  const handleUpdate = (updatedUser) => {
    setCurrentUser(updatedUser);
    setOpenEditProfile(false);
    queryClient.invalidateQueries(["user", userId]);
  };

  if (!userId) return <div>Loading...</div>;

  return (
    <div className="profile">
      <div className="images">
        <img
          src={currentUser?.coverPic ? currentUser.coverPic : DefaultProfilePic}
          alt=""
          className="cover"
        />
        <img
          src={
            currentUser?.profilePic ? currentUser.profilePic : DefaultProfilePic
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
            <span>{currentUser?.name}</span>
            <div className="info">
              <div className="item">
                <PlaceIcon />
                <span>{currentUser?.city}</span>
              </div>
              <div className="item">
                <LanguageIcon />
                <span>{currentUser?.website}</span>
              </div>
            </div>
            {userId === currentUser.id ? (
              <button onClick={() => setOpenEditProfile(true)}>
                Edit Profile
              </button>
            ) : (
              <button onClick={handleFollow}>
                {isFollowing ? "Unfollow" : "Follow"}
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
          user={currentUser}
          onUpdate={handleUpdate}
        />
      )}
      {openEditProfile && (
        <EditProfileForm
          user={currentUser}
          onClose={() => setOpenEditProfile(false)}
          onUpdate={handleUpdate}
        />
      )}
    </div>
  );
};

export default Profile;
