import React, { useState } from "react";
import { makeRequest } from "../../axios";
import "./update.scss";

const Update = ({ setOpenUpdate, user, onUpdate }) => {
  const [coverPic, setCoverPic] = useState(null);
  const [profilePic, setProfilePic] = useState(null);
  const [inputs, setInputs] = useState({
    name: user.name,
    city: user.city,
    website: user.website,
  });

  const handleChange = (e) => {
    setInputs((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    let coverPicUrl = user.coverPic;
    let profilePicUrl = user.profilePic;

    if (coverPic) {
      const formData = new FormData();
      formData.append("file", coverPic);
      const coverUploadRes = await makeRequest.post("/upload", formData);
      coverPicUrl = coverUploadRes.data.filename;
    }

    if (profilePic) {
      const formData = new FormData();
      formData.append("file", profilePic);
      const profileUploadRes = await makeRequest.post("/upload", formData);
      profilePicUrl = profileUploadRes.data.filename;
    }

    const updatedUser = {
      ...inputs,
      coverPic: coverPicUrl,
      profilePic: profilePicUrl,
    };

    await makeRequest.put("/users", updatedUser);

    onUpdate(updatedUser);
  };

  return (
    <div className="update">
      <form onSubmit={handleUpdate}>
        <h1>Update Your Profile</h1>
        <label>
          Cover Picture
          <input type="file" onChange={(e) => setCoverPic(e.target.files[0])} />
        </label>
        <label>
          Profile Picture
          <input
            type="file"
            onChange={(e) => setProfilePic(e.target.files[0])}
          />
        </label>
        <label>
          City
          <input
            type="text"
            name="city"
            value={inputs.city}
            onChange={handleChange}
          />
        </label>
        <label>
          Website
          <input
            type="text"
            name="website"
            value={inputs.website}
            onChange={handleChange}
          />
        </label>
        <label>
          Name
          <input
            type="text"
            name="name"
            value={inputs.name}
            onChange={handleChange}
          />
        </label>
        <button type="submit">Update</button>
      </form>
      <button className="close" onClick={() => setOpenUpdate(false)}>
        X
      </button>
    </div>
  );
};

export default Update;
