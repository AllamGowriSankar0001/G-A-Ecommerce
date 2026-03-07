const mongoose = require("mongoose");

const ConnectDb = async () => {
  try {
    const connect = await mongoose.connect(process.env.MONGODBURL);
    console.log("Connected to DB:", mongoose.connection.name);
    console.log("Host:", mongoose.connection.host);
  } catch (err) {
    console.log("Error connecting the Database", err);
  }
};
module.exports = ConnectDb;
