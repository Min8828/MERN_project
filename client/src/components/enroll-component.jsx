import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import CourseService from "../services/course.service";

const EnrollComponent = (props) => {
  const navigate = useNavigate();
  let { currentUser, setCurrentUser, courseData, setCourseData } = props;
  let [searchInput, setSearchInput] = useState("");
  let [searchResult, setSearchResult] = useState(null);
  let [isEnroll, setIsEnroll] = useState(false);
  let [courses, setCourses] = useState([]);
  let [display, setDisplay] = useState("flex");

  const handleTakeToLogin = () => {
    navigate("/login");
  };
  const handleChangeInput = (e) => {
    setSearchInput(e.target.value);
  };
  const handleSearch = () => {
    CourseService.getCourseByName(searchInput)
      .then((data) => {
        let students = data.data[0].students;
        setSearchResult(data.data);
        setIsEnroll(students.includes(currentUser.user._id));
      })
      .catch((err) => {
        console.log(err);
      });
    if (searchInput) setDisplay("none");
    else setDisplay("flex");
  };

  const handleEnroll = (e) => {
    CourseService.enroll(e.target.id)
      .then(() => {
        window.alert("課程註冊成功。重新導向到課程頁面。");
        navigate("/course");
      })
      .catch((err) => {
        console.log(err);
      });
  };
  useEffect(() => {
    CourseService.getAllCourses().then((data) => {
      // 對於每一個 data.data 中的元素，我們在 courseData 中搜尋具有相同 _id的元素，如果找到了，則將 data.data 中的元素過濾掉，否則將它留下
      let unEnrolledCourse = data.data.filter(
        (x) => !courseData.some((y) => y._id === x._id)
      );
      setCourses(unEnrolledCourse);
    });
  }, []);

  return (
    <div style={{ padding: "3rem" }}>
      {!currentUser && (
        <div>
          <p>您必須先登入才能開始註冊課程</p>
          <button
            onClick={handleTakeToLogin}
            className="btn btn-primary btn-lg"
          >
            回到登入頁面
          </button>
        </div>
      )}
      {currentUser && currentUser.user.role == "instructor" && (
        <div>
          <h1>只有學生可以註冊課程</h1>
        </div>
      )}
      {currentUser && currentUser.user.role == "student" && (
        <div className="search input-group mb-3">
          <input
            onChange={handleChangeInput}
            className="form-control"
            type="text"
          />
          <button onClick={handleSearch} className="btn btn-primary">
            Search
          </button>
        </div>
      )}

      {currentUser.user.role == "student" && courses && (
        <div style={{ display: display, flexWrap: "wrap" }}>
          {courses.map((course) => {
            return (
              <div
                key={course._id}
                className="card"
                style={{ width: "18rem", margin: " 1rem" }}
              >
                <div className="card-body">
                  <h5 className="card-title">課程名稱：{course.title}</h5>
                  <p className="card-text">{course.description}</p>
                  <p style={{ margin: "0.5rem 0rem" }}>
                    講師:{course.instructor.username}
                  </p>
                  <p>價格: {course.price}</p>
                  <p>目前的學生人數: {course.students.length}</p>
                  <a
                    onClick={handleEnroll}
                    href="#"
                    className="card-text btn btn-primary"
                    id={course._id}
                  >
                    註冊課程
                  </a>
                </div>
              </div>
            );
          })}
        </div>
      )}
      {currentUser.user.role == "student" &&
        !isEnroll &&
        searchResult &&
        searchResult.length != 0 && (
          <div>
            <p>我們從 API 返回的數據。</p>
            {searchResult.map((course) => (
              <div key={course._id} className="card" style={{ width: "18rem" }}>
                <div className="card-body">
                  <h5 className="card-title">課程名稱：{course.title}</h5>
                  <p className="card-text">{course.description}</p>
                  <p style={{ margin: "0.5rem 0rem" }}>
                    講師:{course.instructor.username}
                  </p>
                  <p>價格: {course.price}</p>
                  <p>目前的學生人數: {course.students.length}</p>
                  <a
                    onClick={handleEnroll}
                    href="#"
                    className="card-text btn btn-primary"
                    id={course._id}
                  >
                    註冊課程
                  </a>
                </div>
              </div>
            ))}
          </div>
        )}
      {isEnroll && <div className="alert alert-danger">已經註冊過了</div>}
    </div>
  );
};

export default EnrollComponent;
