import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import CourseService from "../services/course.service";

const EditCourseComponent = (props) => {
  const navigate = useNavigate();
  let { currentUser, setCurrentUser, editCourse, setEditCourse } = props;

  let [title, setTitle] = useState("");
  let [description, setDescription] = useState("");
  let [price, setPrice] = useState(0);
  let [courseId, setCourseId] = useState("");
  let [message, setMessage] = useState("");

  const handleTakeToLogin = () => {
    navigate("/login");
  };
  const handleChangeTitle = (e) => {
    setTitle(e.target.value);
  };
  const handleChangeDesciption = (e) => {
    setDescription(e.target.value);
  };
  const handleChangePrice = (e) => {
    setPrice(e.target.value);
  };
  const handleEditCourse = () => {
    CourseService.edit(courseId, title, description, price)
      .then(() => {
        window.alert("課程已更新");
        setEditCourse({});
        navigate("/course");
      })
      .catch((error) => {
        console.log(error.response);
        setMessage(error.response.data);
      });
  };

  useEffect(() => {
    CourseService.getCourseByName(editCourse).then((data) => {
      setTitle(data.data[0].title);
      setDescription(data.data[0].description);
      setPrice(data.data[0].price);
      setCourseId(data.data[0]._id);
    });
  }, []);

  return (
    <div style={{ padding: "3rem" }}>
      {!currentUser && (
        <div>
          <p>在更改新課程之前，您必須先登錄</p>
          <button
            className="btn btn-primary btn-lg"
            onClick={handleTakeToLogin}
          >
            帶我進入登錄頁面。
          </button>
        </div>
      )}
      {currentUser && currentUser.user.role !== "instructor" && (
        <div>
          <p>只有講師可以更改新課程</p>
        </div>
      )}
      {currentUser && currentUser.user.role === "instructor" && (
        <div className="form-group">
          <label htmlFor="exampleforTitle">課程標題：</label>
          <input
            onChange={handleChangeTitle}
            className="form-control"
            id="exampleforTitle"
            type="text"
            name="title"
            value={title}
          />
          <br />
          <label htmlFor="exampleforContent">內容：</label>
          <textarea
            onChange={handleChangeDesciption}
            className="form-control"
            id="exampleforContent"
            aria-describedby="emailHelp"
            name="description"
            value={description}
          />
          <br />
          <label htmlFor="exampleforPrice">價格：</label>
          <input
            onChange={handleChangePrice}
            className="form-control"
            id="exampleforPrice"
            type="number"
            name="price"
            value={price}
          />
          <br />

          <button onClick={handleEditCourse} className="btn btn-primary">
            更新課程
          </button>

          <br />
          <br />
          {message && (
            <div className="alert alert-warning" role="alert">
              {message}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default EditCourseComponent;
