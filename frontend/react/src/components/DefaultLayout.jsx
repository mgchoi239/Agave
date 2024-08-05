import { Link, Outlet, Navigate } from "react-router-dom";
import { useStateContext } from "../contexts/ContextProvider.jsx";
import { useEffect } from "react";
import axiosClient from "../axios-client.js";

export default function DefaultLayout() {
  const { user, token, setUser, setToken } = useStateContext();

  if (!token) {
    return <Navigate to="/login" />;
  }

  const onLogout = (ev) => {
    console.log("log out function");
    ev.preventDefault();

    axiosClient.post("/logout").then(() => {
      setUser({});
      setToken(null);
    });
  };

  useEffect(() => {
    axiosClient.get("/user").then(({ data }) => {
      setUser(data);
    });
  }, []);

  return (
    <div>
      <div>Welcome [User] {user.name} !</div>
      <div>
        <Link to="/dashboard" className="text-green-transition">
          Dashboard
        </Link>
      </div>
      <div>
        <a onClick={onLogout} className="text-green-transition">
          Logout
        </a>
      </div>
      <Outlet />
    </div>
  );
}
