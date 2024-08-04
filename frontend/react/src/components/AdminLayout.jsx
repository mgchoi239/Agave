import { Link, Outlet, Navigate } from "react-router-dom";
import { useStateContext } from "../contexts/ContextProvider.jsx";
import { useEffect } from "react";
import Dashboard from "../views/Dashboard";
import axiosClient from "../axios-client.js";

export default function DefaultLayout() {
  const { user, token, notification, setUser, setToken, setNotification } =
    useStateContext();

  const onLogout = (ev) => {
    console.log("log out function");
    ev.preventDefault();

    axiosClient.post("/logout").then(() => {
      setUser({});
      setToken(null);
    });
  };

  useEffect(() => {
    if (token) {
      axiosClient.get("/user").then(({ data }) => {
        setUser(data);
      });
    }
  }, [token, setUser]);

  if (!token) {
    console.log("no token");
    return <Navigate to="/login" />;
  }

  if (!user.is_admin) {
    console.log("not admin");
    return <Dashboard />;
  }
  console.log("admin");
  return (
    <div>
      <div>Welcome Admin {user.name} !</div>
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
