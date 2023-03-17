import axios from "axios";
// const API_URL = "http://localhost:8080/api/courses";
const API_URL = "https://mern-app-backend-3lvp.onrender.com/api/courses"; // backend

class CourseService {
  // instructor 建立新課程
  post(title, description, price) {
    let token;
    if (localStorage.getItem("user"))
      token = JSON.parse(localStorage.getItem("user")).token;
    else token = "";

    return axios.post(
      API_URL,
      { title, description, price },
      { headers: { Authorization: token } }
    );
  }

  // 使用 student id，來找到學生註冊的課程
  getEnrolledCourses(_id) {
    let token;
    if (localStorage.getItem("user"))
      token = JSON.parse(localStorage.getItem("user")).token;
    else token = "";

    return axios.get(API_URL + "/student/" + _id, {
      headers: { Authorization: token },
    });
  }

  // 使用 instructor id，來找到講師擁有的課程
  get(_id) {
    let token;
    if (localStorage.getItem("user"))
      token = JSON.parse(localStorage.getItem("user")).token;
    else token = "";

    return axios.get(API_URL + "/instructor/" + _id, {
      headers: { Authorization: token },
    });
  }
  // in enroll page 顯示目前所有課程
  getAllCourses() {
    let token;
    if (localStorage.getItem("user"))
      token = JSON.parse(localStorage.getItem("user")).token;
    else token = "";

    return axios.get(API_URL, {
      headers: { Authorization: token },
    });
  }

  // student 用課程名稱尋找課程
  getCourseByName(name) {
    let token;
    if (localStorage.getItem("user"))
      token = JSON.parse(localStorage.getItem("user")).token;
    else token = "";

    return axios.get(API_URL + "/findByName/" + name, {
      headers: { Authorization: token },
    });
  }

  // student 註冊課程
  enroll(courseId) {
    let token;
    if (localStorage.getItem("user"))
      token = JSON.parse(localStorage.getItem("user")).token;
    else token = "";

    return axios.post(
      API_URL + "/enroll/" + courseId,
      {},
      {
        headers: { Authorization: token },
      }
    );
  }

  // instructor 更改課程內容
  edit(courseId, title, description, price) {
    let token;
    if (localStorage.getItem("user"))
      token = JSON.parse(localStorage.getItem("user")).token;
    else token = "";

    return axios.patch(
      API_URL + "/" + courseId,
      { title, description, price },
      {
        headers: { Authorization: token },
      }
    );
  }

  // instructor 刪除課程內容
  delete(courseId) {
    let token;
    if (localStorage.getItem("user"))
      token = JSON.parse(localStorage.getItem("user")).token;
    else token = "";

    return axios.delete(API_URL + "/" + courseId, {
      headers: { Authorization: token },
    });
  }
}

export default new CourseService();
