import { Link, Outlet, Navigate } from "react-router-dom";
import { useStateContext } from "../contexts/ContextProvider.jsx";
import { useEffect } from "react";
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
    return <Navigate to="/login" />;
  }

  if (!user.is_admin) {
    return <DefaultLayout />;
  }

  return (
    <div>
      <div>Welcome [Admin] {user.name} !</div>
      <Link to="/" className="text-green-transition">
        Home
      </Link>
      <br />
      <Link
        to="/users"
        state={{ isAdmin: user.is_admin }}
        className="text-green-transition"
      >
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
