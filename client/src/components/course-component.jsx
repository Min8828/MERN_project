import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import CourseService from "../services/course.service";

const CourseComponent = ({
  currentUser,
  setCurrentUser,
  editCourse,
  setEditCourse,
  courseData,
  setCourseData,
}) => {
  const navigate = useNavigate();
  const handleTakeToLogin = () => {
    navigate("/login");
  };

  const handleEditButton = (e) => {
    setEditCourse(e.target.parentElement.children[0].innerText);

    navigate("/edit");
  };

  const handleDeleteButton = (e) => {
    CourseService.getCourseByName(
      e.target.parentElement.children[0].innerText
    ).then((d) => {
      CourseService.delete(d.data[0]._id);
      window.alert("成功刪除課程");
      window.location.reload();
    });
  };

  useEffect(() => {
    let _id;
    if (currentUser) {
      _id = currentUser.user._id;
      if (currentUser.user.role == "instructor") {
        CourseService.get(_id)
          .then((data) => {
            // console.log(data);
            setCourseData(data.data);
          })
          .catch((e) => console.log(e));
      } else if (currentUser.user.role == "student") {
        CourseService.getEnrolledCourses(_id)
          .then((data) => {
            // console.log(data);
            setCourseData(data.data);
          })
          .catch((e) => console.log(e));
      }
    }
  }, []);

  return (
    <div style={{ padding: "3rem" }}>
      {!currentUser && (
        <div>
          <p>您必須先登入才能看到課程。</p>
          <button
            className="btn btn-primary btn-lg"
            onClick={handleTakeToLogin}
          >
            回到登入頁面
          </button>
        </div>
      )}
      {currentUser && currentUser.user.role == "instructor" && (
        <div>
          <h1>歡迎來到講師的課程頁面。</h1>
        </div>
      )}
      {currentUser && currentUser.user.role == "student" && (
        <div>
          <h1>歡迎來到學生的課程頁面。</h1>
        </div>
      )}
      {currentUser && courseData && courseData.length != 0 && (
        <div style={{ display: "flex", flexWrap: "wrap" }}>
          {courseData.map((course) => {
            return (
              <div
                key={course._id}
                className="card"
                style={{ width: "18rem", margin: "1rem" }}
              >
                <div className="card-body">
                  <h5 className="card-title">{course.title}</h5>
                  <p style={{ margin: "0.5rem 0rem" }} className="card-text">
                    課程描述: {course.description}
                  </p>
                  <p style={{ margin: "0.5rem 0rem" }}>
                    學生人數: {course.students.length}
                  </p>
                  <p style={{ margin: "0.5rem 0rem" }}>
                    課程價格: {course.price}
                  </p>
                  {currentUser.user.role == "instructor" && (
                    <button
                      onClick={handleEditButton}
                      type="button"
                      className="btn btn-primary"
                    >
                      更改
                    </button>
                  )}
                  {currentUser.user.role == "instructor" && (
                    <button
                      onClick={handleDeleteButton}
                      type="button"
                      className="btn btn-danger"
                      style={{ margin: "0rem 1rem" }}
                    >
                      刪除
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default CourseComponent;
