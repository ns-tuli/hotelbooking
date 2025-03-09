import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import jwt_decode from "jwt-decode";

const Dashboard = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem("access_token");

    if (!token) {
      navigate("/login"); // Redirect to login if there's no token
    }

    // Fetch user data with JWT token
    const fetchUser = async () => {
      // Retrieve the token from localStorage
      const token = localStorage.getItem("access_token");

      // Check if the token exists
      if (!token) {
        console.error("Token not found. Please log in.");
        return;
      }

      // Decode the JWT token to get the userId
      const decodedToken = jwt_decode(token); // You'll need the jwt-decode package for this
      const userId = decodedToken.id; // Assuming 'id' is the key that stores the user ID

      // Now you can use the userId to make the API request
      try {
        const response = await axios.get(
          `http://localhost:8800/api/users/${userId}`,
          {
            headers: {
              Authorization: `Bearer ${token}`, // Pass the token in Authorization header
            },
          }
        );
        console.log("User data fetched:", response.data);
      } catch (err) {
        console.error("Error fetching user:", err);
      }
    };

    fetchUser();
  }, [navigate]);

  return (
    <div>
      {user ? (
        <div>
          <h1>Welcome, {user.username}!</h1>
          <p>Email: {user.email}</p>
        </div>
      ) : (
        <p>Loading user data...</p>
      )}
    </div>
  );
};

export default Dashboard;
