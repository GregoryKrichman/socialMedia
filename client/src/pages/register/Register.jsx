import { Link } from "react-router-dom";
import "./register.scss";
import { useState } from "react";
import axios from "axios";

const Register = () => {
  const [inputs, setInputs] = useState({
    username: "",
    email: "",
    password: "",
    name: "",
  });
  const [err, setErr] = useState(false);
  const [errMsg, setErrMsg] = useState("");

  const handleChange = (e) => {
    setInputs((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleClick = async (e) => {
    e.preventDefault();

    try {
      await axios.post("http://localhost:8800/api/auth/register", inputs);
      setErr(false);
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
            />
            <input
              type="email"
              placeholder="Email"
              name="email"
              onChange={handleChange}
            />
            <input
              type="password"
              placeholder="Password"
              name="password"
              onChange={handleChange}
            />
            <input
              type="text"
              placeholder="Name"
              name="name"
              onChange={handleChange}
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
