import axios from "axios";
// const API_URL = "http://localhost:8080/api/user";
const API_URL = "https://mern-app-backend-3lvp.onrender.com"; // backend

class AuthService {
  login(email, password) {
    return axios.post(API_URL + "/login", { email, password });
  }
  logout() {
    localStorage.removeItem("user");
  }

  register(username, email, password, role) {
    // axios.post return a Promise
    return axios.post(API_URL + "/register", {
      username,
      email,
      password,
      role,
    });
  }

  getCurrentUser() {
    return JSON.parse(localStorage.getItem("user"));
  }
}

// 製作新的 object
export default new AuthService();
