const mongoose = require("mongoose");

const itemsSchema = {
  name: {
    type: String,
  },
};

const listsSchema = {
  name: String,
  items: [itemsSchema],
};

module.exports = {
  Item: mongoose.model("Item", itemsSchema),
  List: mongoose.model("List", listsSchema),
};
