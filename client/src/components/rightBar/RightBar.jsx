import "./rightBar.scss";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { makeRequest } from "../../axios";
import DefaultProfilePic from "../../assets/blank-profile-picture.png";
import { useState } from "react";
import { useAuth } from "../../context/authContext";

const RightBar = () => {
  const { currentUser } = useAuth();
  const queryClient = useQueryClient();
  const [suggestions, setSuggestions] = useState([]);

  const { isLoading: isLoadingSuggestions } = useQuery({
    queryKey: ["suggestions"],
    queryFn: () =>
      makeRequest.get("/users/suggestions").then((res) => {
        setSuggestions(res.data);
        return res.data;
      }),
  });

  const { data: latestActivities, isLoading: isLoadingActivities } = useQuery({
    queryKey: ["latestActivities"],
    queryFn: () =>
      makeRequest.get("/users/latestActivities").then((res) => res.data),
  });

  const { data: onlineFriends, isLoading: isLoadingOnlineFriends } = useQuery({
    queryKey: ["onlineFriends"],
    queryFn: () =>
      makeRequest.get("/users/onlineFriends").then((res) => res.data),
  });

  const followMutation = useMutation({
    mutationFn: (userId) => {
      return makeRequest.post("/relationships", {
        FollowerUserId: currentUser.userId,
        FollowedUserId: userId,
      });
    },
    onSuccess: (_, userId) => {
      setSuggestions((prevSuggestions) =>
        prevSuggestions.filter((user) => user.id !== userId)
      );
      queryClient.invalidateQueries(["onlineFriends"]);
      queryClient.invalidateQueries(["latestActivities"]);
    },
    onError: (error) => {
      console.error(
        "Follow error:",
        error.response ? error.response.data : error.message
      );
    },
  });

  const handleFollow = (userId) => {
    followMutation.mutate(userId);
  };

  const handleDismiss = (userId) => {
    setSuggestions((prevSuggestions) =>
      prevSuggestions.filter((user) => user.id !== userId)
    );
    if (suggestions.length < 4) {
      queryClient.invalidateQueries(["suggestions"]);
    }
  };

  return (
    <div className="rightBar">
      <div className="container">
        <div className="item">
          <span>Suggestions For You</span>
          {isLoadingSuggestions ? (
            <div>Loading...</div>
          ) : (
            suggestions.slice(0, 3).map((user) => (
              <div className="user" key={user.id}>
                <div className="userInfo">
                  <img
                    src={
                      user.profilePic
                        ? `/uploads/${user.profilePic}`
                        : DefaultProfilePic
                    }
                    alt=""
                  />
                  <span>{user.name}</span>
                </div>
                <div className="buttons">
                  <button onClick={() => handleFollow(user.id)}>follow</button>
                  <button onClick={() => handleDismiss(user.id)}>
                    dismiss
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
        <div className="item">
          <span>Latest Activities</span>
          {isLoadingActivities ? (
            <div>Loading...</div>
          ) : (
            latestActivities?.slice(0, 3).map((activity) => (
              <div className="user" key={activity.id}>
                <div className="userInfo">
                  <img
                    src={
                      activity.profilePic
                        ? `/upload/${activity.profilePic}`
                        : DefaultProfilePic
                    }
                    alt=""
                  />
                  <p>
                    <span>{activity.name}</span> {activity.activity}
                  </p>
                </div>
                <span>{new Date(activity.createdAt).toLocaleTimeString()}</span>
              </div>
            ))
          )}
        </div>
        <div className="item">
          <span>Online Friends</span>
          {isLoadingOnlineFriends ? (
            <div>Loading...</div>
          ) : (
            onlineFriends?.slice(0, 3).map((friend) => (
              <div className="user" key={friend.id}>
                <div className="userInfo">
                  <img
                    src={
                      friend.profilePic
                        ? `/upload/${friend.profilePic}`
                        : DefaultProfilePic
                    }
                    alt=""
                  />
                  <div className="online" />
                  <span>{friend.name}</span>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default RightBar;
