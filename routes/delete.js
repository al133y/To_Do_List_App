const express = require("express");
const router = express.Router();
const date = require(__dirname + "/../date.js");
const Models = require(__dirname + "/../Models/index.js");

// Models ------------------------

const Item = Models.Item;
const List = Models.List;

// ------ Global middleware -----------

router.use((req, res, next) => {
  console.log(`a delete route was made`);
  next();
});

// Request methods ------------------------

router.post("/", async function (req, res) {
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
      res.status(5000).redirect("/");
    }
  } else {
    console.log("itemId doesn't exist");
    res.status(5000).redirect("/");
  }
});

//

module.exports = router;
