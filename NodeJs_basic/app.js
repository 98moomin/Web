const express = require("express");
const bodyParser = require("body-parser");
const spawn = require("child_process").spawn;
const app = express();
const PORT = 9999;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ limit: "1gb", extended: false }));

app.post("/", (req, res) => {
  const net = spawn("python", ["test.py"]);
  net.stdout.on("data", function (data) {
    res.send({ msg: data.toString(), code: "200" });
  });
});

app.listen(PORT, () => {
  console.log(`✅ Listening Server htttp://localhost:${PORT}`);
});
