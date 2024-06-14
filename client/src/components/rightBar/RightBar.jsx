import "./rightBar.scss";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { makeRequest } from "../../axios";
import DefaultProfilePic from "../../assets/blank-profile-picture.png";

const RightBar = () => {
  const queryClient = useQueryClient();

  const { data: suggestions, isLoading: isLoadingSuggestions } = useQuery({
    queryKey: "suggestions",
    queryFn: () =>
      makeRequest.get("/users/suggestions").then((res) => res.data),
  });

  const { data: latestActivities, isLoading: isLoadingActivities } = useQuery({
    queryKey: "latestActivities",
    queryFn: () =>
      makeRequest.get("/users/latestActivities").then((res) => res.data),
  });

  const { data: onlineFriends, isLoading: isLoadingOnlineFriends } = useQuery({
    queryKey: "onlineFriends",
    queryFn: () =>
      makeRequest.get("/users/onlineFriends").then((res) => res.data),
  });

  const followMutation = useMutation({
    mutationFn: (userId) => {
      return makeRequest.post("/relationships", { userId });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: "suggestions" });
      queryClient.invalidateQueries({ queryKey: "onlineFriends" });
      queryClient.invalidateQueries({ queryKey: "latestActivities" });
    },
  });

  const handleFollow = (userId) => {
    followMutation.mutate(userId);
  };

  const handleDismiss = (userId) => {
    queryClient.invalidateQueries({ queryKey: "suggestions" });
  };

  return (
    <div className="rightBar">
      <div className="container">
        <div className="item">
          <span>Suggestions For You</span>
          {isLoadingSuggestions ? (
            <div>Loading...</div>
          ) : (
            suggestions?.map((user) => (
              <div className="user" key={user.id}>
                <div className="userInfo">
                  <img
                    src={
                      user.profilePic
                        ? `/upload/${user.profilePic}`
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
            latestActivities?.map((activity) => (
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
            onlineFriends?.map((friend) => (
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
