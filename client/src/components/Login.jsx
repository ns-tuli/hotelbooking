import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import ThemeToggle from "./ThemeToggle";

const Login = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      // Send login request to backend
      const response = await axios.post(
        "http://localhost:8800/api/auth/login",
        {
          username,
          password,
        }
      );

      // Check if token is present in response data
      if (response.data.token) {
        // Store the JWT token in localStorage
        localStorage.setItem("access_token", response.data.token);
        console.log("Token saved to localStorage:", response.data.token); // For debugging
        navigate("/dashboard"); // Redirect after successful login
      } else {
        console.error("No token received from server.");
      }
    } catch (err) {
      console.error("Login failed:", err);
      alert("Login failed. Please check your credentials.");
    }
  };

  return (
    <div className="max-w-md mx-auto p-4 bg-white dark:bg-gray-800 rounded-md">
      <h1 className="text-2xl font-semibold mb-4">Login</h1>
      <form onSubmit={handleLogin}>
        <input
          type="text"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          className="w-full p-2 mb-4 rounded-md"
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full p-2 mb-4 rounded-md"
        />
        <button
          type="submit"
          className="w-full p-2 bg-blue-500 text-white rounded-md"
        >
          Login
        </button>
      </form>
      <ThemeToggle />
    </div>
  );
};

export default Login;
