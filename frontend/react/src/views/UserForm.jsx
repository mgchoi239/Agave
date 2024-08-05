import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useStateContext } from "../contexts/ContextProvider";
import axiosClient from "../axios-client";
import Home from "./Home";
import "../index.css";

export default function UserForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useStateContext();
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState(null);

  const [editUser, setEditUser] = useState({
    id: null,
    name: "",
    email: "",
    password: "",
    password_confirmation: "",
    is_admin: false,
  });

  if (!user.is_admin) {
    return <Home />;
  }

  if (id) {
    useEffect(() => {
      setLoading(true);
      axiosClient
        .get(`/users/${id}`)
        .then(({ data }) => {
          setLoading(false);
          setEditUser(data);
        })
        .catch(() => {
          setLoading(false);
        });
    }, []);
  }

  const onPromoteClick = (user) => {
    if (!window.confirm("Are you sure you want to promote user to admin?")) {
      return;
    }
    setEditUser((prevUser) => ({
      ...prevUser,
      is_admin: true,
    }));
    if (user.id) {
      axiosClient
        .put(`/users/${user.id}`, user)
        .then(() => {
          navigate("/users");
        })
        .catch((err) => {
          const response = err.response;
          if (response && response.status === 422) {
            setErrors(response.data.errors);
          }
        });
    }
  };

  const onSubmit = (ev) => {
    ev.preventDefault();
    if (editUser.id) {
      axiosClient
        .put(`/users/${editUser.id}`, editUser)
        .then(() => {
          navigate("/users");
        })
        .catch((err) => {
          const response = err.response;
          if (response && response.status === 422) {
            setErrors(response.data.errors);
          }
        });
    } else {
      axiosClient
        .post(`/users`, editUser)
        .then(() => {
          navigate("/users");
        })
        .catch((err) => {
          const response = err.response;
          if (response && response.status === 422) {
            setErrors(response.data.errors);
          }
        });
    }
  };

  return (
    <>
      {editUser.id && <h1>Update User {editUser.name}</h1>}
      {!editUser.id && <h1>New User</h1>}
      <div>
        {loading && <div>Loading...</div>}
        {errors && (
          <div>
            {Object.keys(errors).map((key) => (
              <p key={key}>{errors[key][0]}</p>
            ))}
          </div>
        )}
        {!loading && (
          <form onSubmit={onSubmit}>
            <input
              value={editUser.name}
              onChange={(ev) =>
                setEditUser({ ...editUser, name: ev.target.value })
              }
              placeholder="Name"
            ></input>
            <input
              type="email"
              value={editUser.email}
              onChange={(ev) =>
                setEditUser({ ...editUser, email: ev.target.value })
              }
              placeholder="Email"
            ></input>
            <input
              type="password"
              onChange={(ev) =>
                setEditUser({ ...editUser, password: ev.target.value })
              }
              placeholder="Password"
            ></input>
            <input
              type="password"
              onChange={(ev) =>
                setEditUser({
                  ...editUser,
                  password_confirmation: ev.target.value,
                })
              }
              placeholder="Password Confirmation"
            ></input>
            <button
              className="button promote-button green-transition"
              onClick={(ev) => onPromoteClick(ev)}
              style={{ marginLeft: "10px", marginRight: "10px" }}
            >
              Promote
            </button>
            <button className="outline green-transition">Save</button>
          </form>
        )}
      </div>
    </>
  );
}
