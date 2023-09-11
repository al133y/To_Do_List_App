const express = require("express");
const bodyParser = require("body-parser");
const date = require(__dirname + "/date.js");
// const { MongoDecompressionError, MongoServerClosedError } = require("mongodb");
const mongoose = require("mongoose");
const _ = require("lodash");
const dotenv = require("dotenv");
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

app.set("view engine", "ejs");

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

const CONNECTION = process.env.CONNECTION;

// mongoose.connect("mongodb://localhost:27017/todoList", {
//   useNewUrlParser: true,
// });

const itemsSchema = {
  name: {
    type: String,
  },
};

const Item = mongoose.model("Item", itemsSchema);

const listsSchema = {
  name: String,
  items: [itemsSchema],
};

const List = mongoose.model("List", listsSchema);

const item1 = new Item({ name: "Welcome to you todolist" });
const item2 = new Item({ name: "Hit the + button to add a new item" });
const item3 = new Item({ name: "<-- hit this to delete an item" });

const defaultItems = [item1, item2, item3];

app.get("/", function (req, res) {
  const day = date.getDate();

  Item.find({})
    .then((foundItems) => {
      if (foundItems.length === 0) {
        Item.insertMany(defaultItems)
          .then((result) => {
            console.log("successfully saved default items");
            res.redirect("/");
          })
          .catch((error) => {
            console.log(error);
          });
      } else {
        res.render("list", { listTitle: day, newListItems: foundItems });
      }
    })
    .catch((error) => {
      console.log(error);
    });
});

app.post("/", async function (req, res) {
  const day = date.getDate();

  const listName = req.body.list;
  const itemName = req.body.newItem;
  const newItem = new Item({ name: itemName });

  try {
    if (listName === day) {
      await newItem.save();
      console.log(`successfully inserted ${itemName} in items collection`);
      res.redirect("/");
    } else {
      foundList = await List.findOne({ name: listName });
      foundList.items.push(newItem);
      await foundList.save();
      console.log(`successfully added new item in ${listName}`);
      res.redirect("/" + listName);
    }
  } catch (error) {
    console.log(error);
    res.redirect("/");
  }
});

app.post("/delete", async function (req, res) {
  const day = date.getDate();

  const listTitle = req.body.listTitle;
  const itemId = req.body.checkbox;

  if (itemId) {
    console.log("itemId exists");
    try {
      if (listTitle === day) {
        await Item.findByIdAndRemove(itemId);
        console.log("successfully deleted item from Items collecion");
        res.redirect("/");
      } else {
        const foundList = await List.findOne({ name: listTitle });
        await List.findOneAndUpdate(
          { _id: foundList._id },
          { $pull: { items: { _id: itemId } } }
        );
        console.log(`successfully deleted item from ${listTitle} doc`);
        res.redirect("/" + listTitle);
      }
    } catch (error) {
      console.log(error);
      res.redirect("/");
    }
  }
});

app.get("/:dynamicRoute", async function (req, res) {
  const routeName = _.capitalize(req.params.dynamicRoute);
  console.log(routeName);

  try {
    const list = await List.findOne({ name: routeName });

    if (!list) {
      try {
        const newList = new List({
          name: routeName,
          items: defaultItems,
        });
        await newList.save();
        console.log(`saved new list ${routeName}`);
        res.redirect("/" + routeName);
      } catch (error) {
        console.log(error);
      }
    } else {
      res.render("list", { listTitle: routeName, newListItems: list.items });
    }
  } catch (error) {
    console.log(error);
  }
});

app.get("/about", function (req, res) {
  res.render("about");
});

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
