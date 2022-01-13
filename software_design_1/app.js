const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const app = express();
const PORT = 9999;

mongoose.connect("mongodb://localhost:27017/user");
const db = mongoose.connection;

db.on("error", () => {
  console.log("❌ DB Connection Failed");
});

db.once("open", () => {
  console.log("✅ DB Connected!");
});

let UserSchema = new mongoose.Schema({
  name: String,
  id: String,
  pw: String,
  login: Boolean,
  sugang: [],
});

let Users = mongoose.model("users", UserSchema);

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ limit: "1gb", extended: false }));

//로그인
app.post("/signIn", async (req, res) => {
  res.header("Access-Control-Allow-Origin", "*");
  let input = new Users(req.body);
  let id = input.id;
  let pw = input.pw;
  let findUser = await Users.find({ id: id });
  if (findUser.length != 0) {
    if (findUser[0].pw == pw) {
      await Users.update({ id: input.id }, { login: true });
      res.send({ code: "200", name: findUser[0].name, id: findUser[0].id });
    } else {
      res.send({ code: "301", id: findUser[0].id });
    }
  } else {
    res.send({ code: "300", id: id });
  }
});

//회원가입
app.post("/signUp", async (req, res) => {
  res.header("Access-Control-Allow-Origin", "*");
  let input = new Users(req.body);
  let id = input.id;
  let findUser = await Users.find({ id: id });
  if (findUser.length == 0) {
    input.save();
    res.send("200");
  } else {
    res.send("302");
  }
});

//로그아웃
app.post("/logout", async (req, res) => {
  res.header("Access-Control-Allow-Origin", "*");
  let id = req.body.id;
  await Users.update({ id: id }, { login: false });
  res.send({ code: "200", id: id });
});

//전체 로그아웃
app.get("/logoutAll", async (req, res) => {
  res.header("Access-Control-Allow-Origin", "*");
  let loginUser = await Users.find({ login: true });
  if (loginUser.length != 0) {
    for (let i in loginUser) {
      await Users.update({ id: loginUser[i].id }, { login: false });
    }
  }
  res.send("200");
});

//현재 누구 시간표
app.post("/whois", async (req, res) => {
  res.header("Access-Control-Allow-Origin", "*");
  let loginUser = await Users.find({ login: true });
  if (loginUser.length != 0) {
    res.send({ code: 200, name: loginUser[0].name, id: loginUser[0].id });
  } else {
    res.send("500");
  }
});

//수강신청
app.post("/enroll", async (req, res) => {
  res.header("Access-Control-Allow-Origin", "*");
  let check = true;
  let id = req.body.id;
  let subject = req.body.subject;
  let time = req.body.time;
  let tmp = { subject: subject, time: time };
  let findUser = await Users.find({ id: id });
  let sugang = findUser[0].sugang;
  for (let item of sugang) {
    if (item.subject == tmp.subject) {
      //이미 신청한 과목
      check = false;
      break;
    }
  }
  if (check) {
    sugang.push(tmp);
    let newSugang = sugang;
    await Users.update({ id: id }, { sugang: newSugang });
    res.send({ code: "200", name: findUser[0].name, id: id, subject: subject, time: time });
  } else {
    res.send({ code: "303", subject: subject });
  }
});

//해당 사용자 수강과목
app.post("/getSubject", async (req, res) => {
  res.header("Access-Control-Allow-Origin", "*");
  let id = req.body.id;
  let findUser = await Users.find({ id: id });
  let subjects = findUser[0].sugang;
  res.send({ code: "200", subjects: subjects });
});

app.listen(PORT, () => {
  console.log(`✅ Listening Server htttp://localhost:${PORT}`);
});
