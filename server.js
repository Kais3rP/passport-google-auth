"use strict";

const express = require("express");
const bodyParser = require("body-parser");
const mongo = require("mongodb").MongoClient;
const routes = require("./routes.js");
const auth = require("./auth.js");
const app = express();

app.use("/public", express.static(process.cwd() + "/public"));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.set("view engine", "pug");

mongo.connect(process.env.MONGO_URI, (err, client) => {
  var db = client.db("socialusers");
  if (err) {
    console.log("Database error: " + err);
  } else {
    console.log("Successful database connection");

    //Import authentication logic
    auth(app, db);

    //Import the routes
    routes(app, db);

    app.listen(process.env.PORT || 3000, () => {
      console.log("Listening on port " + process.env.PORT);
    });
  }
});
