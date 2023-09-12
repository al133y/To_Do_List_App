const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const dotenv = require("dotenv");

dotenv.config();

const mainHandler = require(__dirname + "/routes/index.js");
const deleteHandler = require(__dirname + "/routes/delete.js");

const app = express();

const PORT = process.env.PORT || 3000;
const CONNECTION = process.env.CONNECTION;

app.set("view engine", "ejs");

// middleware ----------

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));
app.use("/", mainHandler);
app.use("/delete", deleteHandler);

// Other routes -------------------------

app.get("/about", (req, res) => {
  res.send("this is the about route");
});

// ----------------------------------
const start = async () => {
  try {
    await mongoose.connect(CONNECTION);

    app.listen(PORT, function () {
      console.log(`Server started on port ${PORT}`);
    });
  } catch (e) {
    console.log(e.message);
  }
};

start();
