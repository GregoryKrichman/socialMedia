import React, { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { makeRequest } from "../../axios";
import "./editProfileForm.scss";

const EditProfileForm = ({ user, onClose, onUpdate }) => {
  const [name, setName] = useState(user.name || "");
  const [city, setCity] = useState(user.city || "");
  const [website, setWebsite] = useState(user.website || "");
  const [profilePic, setProfilePic] = useState(null);
  const [coverPic, setCoverPic] = useState(null);

  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: async (updatedUser) => {
      const formData = new FormData();
      formData.append("name", updatedUser.name);
      formData.append("city", updatedUser.city);
      formData.append("website", updatedUser.website);
      if (updatedUser.profilePic) {
        formData.append("profilePic", updatedUser.profilePic);
      }
      if (updatedUser.coverPic) {
        formData.append("coverPic", updatedUser.coverPic);
      }

      return await makeRequest.put(`/users/${user.id}`, formData);
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries(["user", user.id]);
      onUpdate(data.data);
      onClose();
    },
    onError: (error) => console.error("Error updating profile:", error),
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    mutation.mutate({
      name,
      city,
      website,
      profilePic,
      coverPic,
    });
  };

  return (
    <div className="editProfileForm">
      <form onSubmit={handleSubmit}>
        <label>
          Name:
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </label>
        <label>
          City:
          <input
            type="text"
            value={city}
            onChange={(e) => setCity(e.target.value)}
          />
        </label>
        <label>
          Website:
          <input
            type="text"
            value={website}
            onChange={(e) => setWebsite(e.target.value)}
          />
        </label>
        <label>
          Profile Picture:
          <input
            type="file"
            onChange={(e) => setProfilePic(e.target.files[0])}
          />
        </label>
        <label>
          Cover Picture:
          <input type="file" onChange={(e) => setCoverPic(e.target.files[0])} />
        </label>
        <button type="submit">Save Changes</button>
        <button type="button" onClick={onClose}>
          Cancel
        </button>
      </form>
    </div>
  );
};

export default EditProfileForm;
