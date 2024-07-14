import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/authContext";
import "./login.scss";

const Login = () => {
  const [inputs, setInputs] = useState({
    username: "",
    password: "",
  });
  const [err, setErr] = useState(null);

  const navigate = useNavigate();
  const { handleLogin } = useAuth();

  const handleChange = (e) => {
    setInputs((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleLoginClick = async (e) => {
    e.preventDefault();
    try {
      const user = await handleLogin(inputs);
      navigate(`/profile/${user.id}`);
    } catch (err) {
      setErr(err.response ? err.response.data : "Login failed");
    }
  };

  return (
    <div className="login">
      <div className="card">
        <div className="left">
          <h1>MySocialProject</h1>
          <p>
            Welcome to my first full stack project! This platform allows users
            to connect, share, and interact in a social media environment.
            Explore features like user profiles, post creation, real-time
            updates, and much more. Join us and be a part of this exciting
            journey as we build a vibrant community together!
          </p>
          <span>Don't you have an account?</span>
          <Link to="/register">
            <button>Register</button>
          </Link>
        </div>
        <div className="right">
          <h1>Login</h1>
          <form>
            <input
              type="text"
              placeholder="Username"
              name="username"
              onChange={handleChange}
              autoComplete="username"
            />
            <input
              type="password"
              placeholder="Password"
              name="password"
              onChange={handleChange}
              autoComplete="current-password"
            />
            {err && (
              <div className="error">
                {Array.isArray(err.errors) ? err.errors.join(", ") : err}
              </div>
            )}
            <button onClick={handleLoginClick}>Login</button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;
