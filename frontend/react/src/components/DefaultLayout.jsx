import { Link, Outlet, Navigate } from "react-router-dom";
import { useStateContext } from "../contexts/ContextProvider.jsx";
import { useEffect } from "react";
import axiosClient from "../axios-client.js";

export default function DefaultLayout() {
  const { user, token, notification, setUser, setToken, setNotification } =
    useStateContext();

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
      <div>Welcome {user.name} !</div>

      <div>
        <Link to="/dashboard"> Dashboard</Link>
      </div>
      <Link to="/users">Users</Link>
      <div>
        <a onClick={onLogout}>Logout</a>
      </div>
      <Outlet />
      {notification && <div>{notification}</div>}
    </div>
  );
}
