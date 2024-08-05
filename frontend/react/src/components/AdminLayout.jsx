import { Link, Outlet, Navigate } from "react-router-dom";
import { useStateContext } from "../contexts/ContextProvider.jsx";
import { useEffect } from "react";
import Dashboard from "../views/Dashboard";
import axiosClient from "../axios-client.js";
import DefaultLayout from "./DefaultLayout.jsx";

export default function AdminLayout() {
  const { user, token, setUser, setToken } = useStateContext();

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
  }, []);

  if (!token) {
    console.log("no token");
    return <Navigate to="/login" />;
  }

  if (!user.is_admin) {
    console.log("not admin");
    return <DefaultLayout />;
  }

  console.log("admin");

  return (
    <div>
      <div>Welcome [Admin] {user.name} !</div>
      {/* <div>
        <Link to="/dashboard"> Dashboard</Link>
      </div> */}
      <Link to="/users" className="text-green-transition">
        Users
      </Link>
      <div>
        <a onClick={onLogout} className="text-green-transition">
          Logout
        </a>
      </div>
      <Outlet />
    </div>
  );
}
