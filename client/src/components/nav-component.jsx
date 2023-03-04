import React from "react";
// NavLink can highline the active Navigation bar link using
import { NavLink } from "react-router-dom";
import AuthServer from "../services/auth.service";

const NavComponent = ({ currentUser, setCurrentUser }) => {
  const handleLogout = () => {
    AuthServer.logout(); // 清空 localStorage
    window.alert("登出成功!現在您會被導向到首頁");
    setCurrentUser(null);
  };

  return (
    <div>
      <nav className="navbar navbar-expand-lg navbar-dark bg-dark">
        <div className="container-fluid">
          <NavLink className="navbar-brand" to="#">
            學習系統
          </NavLink>
          <button
            class="navbar-toggler"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#navbarNav"
            aria-controls="navbarNav"
            aria-expanded="false"
            aria-label="Toggle navigation"
          >
            <span class="navbar-toggler-icon"></span>
          </button>
          <div className="collapse navbar-collapse" id="navbarNav">
            <ul className="navbar-nav">
              <li className="nav-item">
                <NavLink className="nav-link" to="/">
                  首頁
                </NavLink>
              </li>
              {!currentUser && (
                <li className="nav-item">
                  <NavLink className="nav-link" to="/register">
                    註冊會員
                  </NavLink>
                </li>
              )}
              {!currentUser && (
                <li className="nav-item">
                  <NavLink className="nav-link" to="/login">
                    會員登入
                  </NavLink>
                </li>
              )}
              {currentUser && (
                <li className="nav-item">
                  <NavLink onClick={handleLogout} className="nav-link" to="/">
                    登出
                  </NavLink>
                </li>
              )}
              {currentUser && (
                <li className="nav-item">
                  <NavLink className="nav-link" to="/profile">
                    個人頁面
                  </NavLink>
                </li>
              )}

              {currentUser && (
                <li className="nav-item">
                  <NavLink className="nav-link" to="/course">
                    課程頁面
                  </NavLink>
                </li>
              )}
              {currentUser && currentUser.user.role === "instructor" && (
                <li className="nav-item">
                  <NavLink className="nav-link" to="/postCourse">
                    新增課程
                  </NavLink>
                </li>
              )}
              {currentUser && currentUser.user.role === "student" && (
                <li className="nav-item">
                  <NavLink className="nav-link" to="/enroll">
                    註冊課程
                  </NavLink>
                </li>
              )}
            </ul>
          </div>
        </div>
      </nav>
    </div>
  );
};

export default NavComponent;
