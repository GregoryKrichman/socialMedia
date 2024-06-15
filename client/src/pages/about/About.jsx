import "./about.scss";

const About = () => {
  return (
    <div className="about">
      <div className="container">
        <h1>About MySocialProject</h1>
        <p>
          Welcome to MySocialProject! This is my first full-stack project, and I
          am excited to share it with you. MySocialProject is a social media
          platform where users can interact, share posts, and connect with
          friends. Here’s a brief overview of the features:
        </p>
        <h2>Features</h2>
        <ul>
          <li>
            <strong>User Authentication:</strong> Secure login and registration
            system to protect user data.
          </li>
          <li>
            <strong>Post Creation and Deletion:</strong> Users can create new
            posts and delete their own posts.
          </li>
          <li>
            <strong>Image Uploads:</strong> Easily upload and share images with
            your posts.
          </li>
          <li>
            <strong>Comments:</strong> Engage with posts by adding comments.
          </li>
          <li>
            <strong>Likes:</strong> Show appreciation for posts by liking them.
          </li>
          <li>
            <strong>Relationships:</strong> Follow other users and see their
            updates in your feed.
          </li>
          <li>
            <strong>Stories:</strong> Share short-lived content that disappears
            after 24 hours.
          </li>
        </ul>
        <h2>How to Use MySocialProject</h2>
        <p>
          Using MySocialProject is straightforward. Here are some basic
          instructions:
        </p>
        <ol>
          <li>
            <strong>Sign Up:</strong> Create an account by signing up with your
            email and a secure password.
          </li>
          <li>
            <strong>Login:</strong> Access your account by logging in with your
            credentials.
          </li>
          <li>
            <strong>Create Posts:</strong> Share your thoughts and photos by
            creating new posts.
          </li>
          <li>
            <strong>Interact:</strong> Like and comment on posts to interact
            with other users.
          </li>
          <li>
            <strong>Follow:</strong> Follow other users to see their posts and
            updates.
          </li>
          <li>
            <strong>View Stories:</strong> Check out the latest stories from
            your friends.
          </li>
        </ol>
        <p>
          I hope you enjoy using MySocialProject as much as I enjoyed creating
          it. If you have any feedback or suggestions, feel free to reach out!
        </p>
      </div>
    </div>
  );
};

export default About;
