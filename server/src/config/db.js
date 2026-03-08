const mongoose = require("mongoose");
const config = require("./env");

const connectDatabase = async () => {
  mongoose.set("strictQuery", true);
  await mongoose.connect(config.mongoUri);
  console.log("MongoDB connected");
};

module.exports = connectDatabase;
