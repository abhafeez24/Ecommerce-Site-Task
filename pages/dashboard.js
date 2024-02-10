import React, { useState } from "react";
import Router from "next/router";
import { whoAmI } from "../lib/auth";
import { removeToken } from "../lib/token";
export default function Dashboard() {
  const [user, setUser] = useState({});

  React.useEffect(() => {
    // const token = window.localStorage.getItem("token") || window.sessionStorage.getItem("token");
    // if (!token) {
    //   redirectToLogin();
    // } else {
    //   (async () => {
    //     try {
    //       const data = await whoAmI();
    //       if (data.error === "Unauthorized") {
    //        redirectToLogin();
    //       } else {
    //         setUser(data.payload);
    //       }
    //     } catch (error) {
          
    //       redirectToLogin();
    //     }
    //   })();
    // }
  }, []);

  function redirectToLogin() {
    Router.push("/auth/login");
  }

  function handleLogout(e) {
    e.preventDefault();

    removeToken();
    redirectToLogin();
  }

  if (user.hasOwnProperty("username")) {
    return (
      <>
        <nav className="navbar navbar-light" style={{ backgroundColor: "#e3f2fd" }}>
          <div className="container-fluid">
            <a className="navbar-brand" href="#">
              Welcome {user.username}!
            </a>
            <button
              className="btn btn-info"
              type="button"
              style={{ color: "white", backgroundColor: "#0d6efd" }}
              onClick={handleLogout}
            >
              Logout
            </button>
          </div>
        </nav>
        <h3>{user.username}'s Profile</h3>
      </>
    );
  }
  return <div>Welcome back soldier. Welcome to your empty profile.</div>;
}
