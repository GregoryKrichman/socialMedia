import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/authContext";
import { makeRequest } from "../../axios";
import "./register.scss";

const Register = () => {
  const [inputs, setInputs] = useState({
    username: "",
    email: "",
    password: "",
    name: "",
  });
  const [err, setErr] = useState(false);
  const [errMsg, setErrMsg] = useState("");
  const navigate = useNavigate();
  const { handleLogin, handleRegister, setCurrentUser } = useAuth();

  const handleChange = (e) => {
    setInputs((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleClick = async (e) => {
    e.preventDefault();
    try {
      const res = await makeRequest.post("/auth/register", inputs);
      if (res.data.token) {
        const user = JSON.parse(atob(res.data.token.split(".")[1]));
        localStorage.setItem("token", res.data.token);
        setCurrentUser({ token: res.data.token, ...user });
        navigate(`/profile/${user.userId}`);
      } else {
        throw new Error("Registration response data is undefined");
      }
    } catch (err) {
      setErr(true);
      if (err.response && err.response.data) {
        setErrMsg(err.response.data);
      } else {
        setErrMsg("An error occurred during registration.");
      }
    }
  };

  return (
    <div className="register">
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
          <span>Do you have an account?</span>
          <Link to="/login">
            <button>Login</button>
          </Link>
        </div>
        <div className="right">
          <h1>Register</h1>
          <form>
            <input
              type="text"
              placeholder="Username"
              name="username"
              onChange={handleChange}
              autoComplete="username"
            />
            <input
              type="email"
              placeholder="Email"
              name="email"
              onChange={handleChange}
              autoComplete="email"
            />
            <input
              type="password"
              placeholder="Password"
              name="password"
              autoComplete="new-password"
              onChange={handleChange}
            />
            <input
              type="text"
              placeholder="Name"
              name="name"
              onChange={handleChange}
              autoComplete="name"
            />
            <button type="button" onClick={handleClick}>
              Register
            </button>
            {err && <div className="error">{errMsg}</div>}
          </form>
        </div>
      </div>
    </div>
  );
};

export default Register;
