import { createContext, useContext, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { login, register, logout, getUser } from "../services/authService";
import { jwtDecode } from "jwt-decode";

const AuthContext = createContext();

export const AuthContextProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  const navigate = useNavigate();

  const handleLogin = async (inputs) => {
    const response = await login(inputs);
    const token = response.token;
    const decodedUser = jwtDecode(token);
    const userDetails = await getUser(decodedUser.userId);
    const user = { token, ...decodedUser, ...userDetails };
    setCurrentUser(user);
    localStorage.setItem("token", token);
    navigate("/profile/" + decodedUser.userId);
  };

  const handleRegister = async (inputs) => {
    const response = await register(inputs);
    const token = response.token;
    const decodedUser = jwtDecode(token);
    const userDetails = await getUser(decodedUser.userId);
    const user = { token, ...decodedUser, ...userDetails };
    setCurrentUser(user);
    localStorage.setItem("token", token);
    navigate("/profile/" + decodedUser.userId);
  };

  const handleLogout = async () => {
    await logout();
    setCurrentUser(null);
    localStorage.removeItem("token");
    navigate("/login");
  };

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      const decodedUser = jwtDecode(token);
      getUser(decodedUser.userId).then((userDetails) => {
        const user = { token, ...decodedUser, ...userDetails };
        setCurrentUser(user);
        setIsLoading(false);
      });
    } else {
      setIsLoading(false);
    }
  }, []);

  return (
    <AuthContext.Provider
      value={{
        currentUser,
        isLoading,
        handleLogin,
        handleRegister,
        handleLogout,
        setCurrentUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
