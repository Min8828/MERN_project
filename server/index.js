const express = require("express");
const app = express();
const mongoose = require("mongoose");
const dotenv = require("dotenv");
dotenv.config();
const authRoute = require("./routes").auth;
const courseRoute = require("./routes").course;
const passport = require("passport");
const { session } = require("passport");
require("./config/passport")(passport);
const cors = require("cors");
const PORT = process.env.PORT || 8080;

// localDB: mongodb://127.0.0.1:27017/mernDB
mongoose.set("strictQuery", false);
mongoose
  .connect(process.env.DATABASE)
  .then(() => {
    console.log("Connecting to mongoDB Atlas");
  })
  .catch((e) => {
    console.log(e);
  });

// middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors({}));
// Cross-Origin Resource Sharing (CORS) is an HTTP-header based mechanism that allows a server to indicate any origins (domain, scheme, or port) other than its own from which a browser should permit loading resources.

// router middleware
app.use("/api/user", authRoute);

// 只有登入系統的人(含有JWT)，才能夠去新增課程或是註冊課程
// course route 應該被jwt保護
// 如果 request header 內部沒有 jwt,則 request就會被視為是unauthorized
app.use(
  "/api/courses",
  passport.authenticate("jwt", { session: false }),
  courseRoute
);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}...`);
});
