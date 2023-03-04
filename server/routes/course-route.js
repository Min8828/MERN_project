const router = require("express").Router();
const Course = require("../models").course;
const courseValidation = require("../validation").courseValidation;

router.use((req, res, next) => {
  console.log("course route 正在接受一個 request");
  next();
});

// 獲得系統中的所有課程
router.get("/", async (req, res) => {
  try {
    let courseFound = await Course.find({})
      .populate("instructor", ["username", "email", "password"])
      .exec();
    // populate(Schema的property,[指向_id object的property which you want to show])
    // => reference documents in other collections.
    return res.send(courseFound);
  } catch (e) {
    return res.status(500).send(e);
  }
});

// instructor 創建課程
router.post("/", async (req, res) => {
  // 驗證數據符合規範
  let { error } = courseValidation(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  // req.user => 已認證過的使用者
  if (req.user.isStudent())
    return res
      .status(400)
      .send("只有講師可以發布課程，若你已經是講師，請透過講師帳號登入。");

  let { title, description, price } = req.body;

  try {
    let newCourse = new Course({
      title,
      description,
      price,
      instructor: req.user._id,
    });
    let savedCourse = await newCourse.save();
    return res.send({
      msg: "新課程已保存",
    });
  } catch (e) {
    return res.status(500).send("無法創建課程...");
  }
});

// 使用student id，來找到學生註冊的課程
router.get("/student/:_student_id", async (req, res) => {
  let { _student_id } = req.params;
  let coursesFound = await Course.find({ students: _student_id })
    .populate("instructor", ["username", "email"])
    .exec();

  return res.send(coursesFound);
});

// 使用instructor id，來找到講師擁有的課程
router.get("/instructor/:_instructor_id", async (req, res) => {
  let { _instructor_id } = req.params;
  try {
    let coursesFound = await Course.find({ instructor: _instructor_id })
      .populate("instructor", ["username", "email"])
      .exec();

    return res.send(coursesFound);
  } catch (err) {
    res.status(500).send("Cannot get course data.");
  }
});

// student 用課程名稱尋找課程
router.get("/findByName/:name", async (req, res) => {
  let { name } = req.params;
  try {
    let courseFound = await Course.find({ title: name })
      .populate("instructor", ["username", "email"])
      .exec();
    return res.send(courseFound);
  } catch (e) {
    return res.status(500).send(e);
  }
});

// student 透過 course id 來註冊課程
router.post("/enroll/:_id", async (req, res) => {
  let { _id } = req.params;
  try {
    let course = await Course.findById({ _id }).exec();
    course.students.push(req.user._id); // user 含有 JWT
    await course.save();
    return res.send("註冊完成");
  } catch (e) {
    return res.status(500).send(e);
  }
});

// 用課程id尋找課程
router.get("/:_id", async (req, res) => {
  let { _id } = req.params;
  try {
    let courseFound = await Course.findById({ _id })
      .populate("instructor", ["email"])
      .exec();
    console.log(courseFound);
    return res.send(courseFound);
  } catch (e) {
    return res.status(500).send(e);
  }
});

// instructor 更改課程
router.patch("/:_id", async (req, res) => {
  // 驗證數據符合規範
  let { error } = courseValidation(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  // 確認課程存在
  let { _id } = req.params;
  try {
    let courseFound = await Course.findById({ _id }).exec();
    if (!courseFound)
      return res.status(400).send("找不到課程，無法更新課程內容");

    // 使用者必須是此課程講師，才能編輯課程
    if (courseFound.instructor.equals(req.user._id)) {
      let updatedCourse = await Course.findOneAndUpdate({ _id }, req.body, {
        new: true,
        runValidators: true,
      }).exec();
      return res.send({ msg: "課程已經被更新成功", updatedCourse });
    } else {
      return res.status(403).send("只有此課程的講師才能編輯課程");
    }
  } catch (e) {
    return res.status(500).send(e);
  }
});

router.delete("/:_id", async (req, res) => {
  let { _id } = req.params;
  try {
    let courseFound = await Course.findById({ _id }).exec();
    if (!courseFound)
      return res.status(400).send("找不到課程，無法刪除課程內容");

    // 使用者必須是此課程講師，才能刪除課程
    if (courseFound.instructor.equals(req.user._id)) {
      let deletedCourse = await Course.deleteOne({ _id }).exec();
      return res.send("課程已經刪除成功");
    } else {
      return res.status(403).send("只有此課程的講師才能刪除課程");
    }
  } catch (e) {
    return res.status(500).send(e);
  }
});

module.exports = router;
