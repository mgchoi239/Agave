import axios from "axios";
import axiosClient from "../axios-client";
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useStateContext } from "../contexts/ContextProvider";
import Pagination from "rc-pagination";

export default function Users() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);

  useEffect(() => {
    getUsers();
  }, [page]);

  const onPromoteClick = (user) => {
    if (
      !window.confirm("Are you sure you want to promote the user to admin?")
    ) {
      return;
    }
    console.log("clicked");
    axiosClient.delete(`/users/${user.id}`).then(() => {
      getUsers();
    });
  };

  const onDeleteClick = (user) => {
    if (!window.confirm("Are you sure you want to delete this?")) {
      return;
    }
    axiosClient.delete(`/users/${user.id}`).then(() => {
      getUsers();
    });
  };

  const handlePageChange = (page) => {
    setPage(page);
  };

  const itemRender = (curr_page, type, originalElement) => {
    if (type === "prev") {
      return <button>Prev</button>;
    }
    if (type === "next") {
      return <button>Next</button>;
    }
    if (type === "page") {
      return (
        <button
          className={`page-link ${
            type === "page"
              ? curr_page === page
                ? "active"
                : ""
              : "nav-button"
          }`}
          onClick={() => type === "page" && handlePageChange(curr_page)}
        >
          {curr_page}
        </button>
      );
    }
    return originalElement;
  };

  const getUsers = () => {
    setLoading(true);
    axiosClient
      .get(`/users?page=${page}`)
      .then(({ data }) => {
        setLoading(false);
        console.log(data);
        setUsers(data.data);
        setTotal(data.meta.total);
      })
      .catch(() => {
        setLoading(false);
      });
  };

  return (
    <div>
      <div>
        <h1>Users</h1>
        <Link className="link add-link green-transition" to="/users/new">
          Add new
        </Link>
      </div>
      <br />
      <div>
        <table>
          <thead>
            <tr>
              <th>ID</th>
              <th>Name</th>
              <th>Email</th>
              <th>Create Date</th>
              <th>Admin</th>
              <th>Actions</th>
            </tr>
          </thead>
          {loading && (
            <tbody>
              <tr>
                <td>Loading...</td>
              </tr>
            </tbody>
          )}
          {!loading && (
            <tbody>
              {users.map((u) => (
                <tr key={u.id}>
                  <td>{u.id}</td>
                  <td>{u.name}</td>
                  <td>{u.email}</td>
                  <td>{u.created_at}</td>
                  <td>{u.is_admin ? "Yes" : "No"}</td>
                  <td>
                    <Link
                      className="link edit-link green-transition"
                      to={"/users/" + u.id}
                      style={{ marginRight: "10px" }}
                    >
                      Edit
                    </Link>
                    <button
                      className="button promote-button green-transition"
                      onClick={(ev) => onPromoteClick(u)}
                      style={{ marginRight: "10px" }}
                    >
                      Promote
                    </button>
                    <button
                      className="button delete-button green-transition"
                      onClick={(ev) => onDeleteClick(u)}
                      style={{ marginRight: "10px" }}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          )}
        </table>
      </div>
      <div>
        <Pagination
          current={page}
          total={total}
          pageSize={10}
          showPrevNextJumper={false}
          onChange={handlePageChange}
          className="pagination"
          itemRender={itemRender}
        />
      </div>
    </div>
  );
}
