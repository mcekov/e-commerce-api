const express = require("express");
const app = express();
const PORT = process.env.PORT || 5000;

const connectDB = require("./db/connect");
require("dotenv").config();

const start = async () => {
  try {
    await connectDB(process.env.MONGO_URI);

    app.listen(PORT, () => {
      console.log(`Server is listening on port: ${PORT}`);
      console.log("DB Connected...");
    });
  } catch (error) {
    console.log(error);
  }
};

start();
