const express = require("express");
const path = require("path");
const bodyParser = require("body-parser");
const cors = require("cors");
const passport = require("passport");
const mongoose = require("mongoose");
const users = require("./routes/users");
const config = require("./config/database");

// Connect to Database
mongoose.connect(config.database);
// on Connection
mongoose.connection.on("connected", () => {
  console.log("Connected to Database " + config.database);
});
// on Error
mongoose.connection.on("error", (err) => {
  console.log("Database error: " + err);
});

const app = express();

// port number
const port = process.env.PORT || 4000;

//미들웨어
// 클라이언트의 요청시간을 콘솔에 표시하도록 하는 미들웨어
app.use(function (req, res, next) {
  console.log("Time: ", Date.now());
  next();
});
// CORS 미들웨어
app.use(cors());
// JSON 활용을 위한 미들웨어
app.use(express.json());
// URL 인코딩된 데이터의 활용을 위한 미들웨어
app.use(express.urlencoded({ extended: true }));
// Static Folder 기능을 제공하는 미들웨어
app.use(express.static(path.join(__dirname, "public")));
// Passport 미들웨어
app.use(passport.initialize());
//app.use(passport.session());
require("./config/passport")(passport);

// 라우팅 설정을 위한 미들웨어 (맨뒤에 넣음)
app.use("/users", users);

// start server
app.listen(port, () => {
  console.log(`Server started on port ${port}`);
});
