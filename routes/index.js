const express = require("express");
const router = express.Router();
const date = require(__dirname + "/../date.js");
const Models = require(__dirname + "/../Models/index.js");
const _ = require("lodash");

// Models ------------------------

const Item = Models.Item;
const List = Models.List;
const defaulItems = Models.defaulItems;

// default items -----------------

const item1 = new Item({ name: "Welcome to you todolist" });
const item2 = new Item({ name: "Hit the + button to add a new item" });
const item3 = new Item({ name: "<-- hit this to delete an item" });

const defaultItems = [item1, item2, item3];

// ------ Global middleware -----------

router.use((req, res, next) => {
  console.log(`this the the '${req.path}' route`);
  next();
});

// Request methods ------------------------
router.get("/", async (req, res) => {
  try {
    const day = date.getDate();

    // finds all documents
    const foundItems = await Item.find({});

    if (foundItems.length === 0) {
      await Item.insertMany(defaultItems);
      console.log("Successfully saved default items");
      res.redirect("/");
    } else {
      res.render("list", { listTitle: day, newListItems: foundItems });
    }
  } catch (error) {
    console.error(error);
    res.status(500).send("An error occurred");
  }
});

router.post("/", async function (req, res) {
  const day = date.getDate();

  const listName = req.body.list;
  const itemName = req.body.newItem;

  // creates a new item
  const newItem = new Item({ name: itemName });

  try {
    if (listName === day) {
      await newItem.save();
      console.log(
        `successfully inserted '${itemName}' in Main items collection`
      );
      res.redirect("/");
    } else {
      foundList = await List.findOne({ name: listName });
      foundList.items.push(newItem);
      await foundList.save();
      console.log(`successfully added '${itemName}' to '${listName}' list`);
      res.redirect("/" + listName);
    }
  } catch (error) {
    console.log(error);
    res.status(5000).redirect("/");
  }
});

// Dynamic Route -------------------------------------------

router.get("/:dynamicRoute", async function (req, res) {
  const routeName = _.capitalize(req.params.dynamicRoute);

  try {
    const list = await List.findOne({ name: routeName });

    if (!list) {
      try {
        const newList = new List({
          name: routeName,
          items: defaultItems,
        });
        await newList.save();
        console.log(`saved new Defaults items to '${routeName}' List`);
        res.redirect("/" + routeName);
      } catch (e) {
        console.log(e);
        res.status(5000).send(e.message);
      }
    } else {
      res.render("list", { listTitle: routeName, newListItems: list.items });
    }
  } catch (e) {
    console.log(e);
    res.status(5000).send(e.message);
  }
});

module.exports = router;
