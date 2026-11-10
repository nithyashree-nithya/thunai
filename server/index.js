"use strict";

require("dotenv").config();
const { createApp } = require("./app");

const port = Number(process.env.PORT) || 3000;
createApp().listen(port, () => {
  console.log("Thunai is running at http://localhost:" + port);
});
