function getFormattedDate(options) {
  const today = new Date();
  return today.toLocaleDateString("en-US", options);
}

module.exports = {
  getDate() {
    const options = {
      weekday: "long",
      day: "numeric",
      month: "long",
    };

    return getFormattedDate(options);
  },

  getDay() {
    const options = {
      weekday: "long",
    };

    return getFormattedDate(options);
  },
};
