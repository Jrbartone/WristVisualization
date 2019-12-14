// server.js
// where your node app starts

// init project
const express = require("express");
const app = express();

// we've started you off with Express,
// but feel free to use whatever libs or frameworks you'd like through `package.json`.

// http://expressjs.com/en/starter/static-files.html
app.use(express.static("public"));

// http://expressjs.com/en/starter/basic-routing.html
app.get("/", function(request, response) {
  response.sendFile(__dirname + "/views/index.html");
});

app.get("/sketch.js", function(request, response) {
  response.sendFile(__dirname + "/sketch.js");
});

app.get("/wrist.js", function(request, response) {
  response.sendFile(__dirname + "/wrist.js");
});

app.get("/libs/p5.min.js", function(request, response) {
  response.sendFile(__dirname + "/libs/p5.min.js");
});

app.get("/libs/quicksettings.min.js", function(request, response) {
  response.sendFile(__dirname + "/libs/quicksettings.min.js");
});

app.get("/libs/reconnecting-websocket.js", function(request, response) {
  response.sendFile(__dirname + "/libs/reconnecting-websocket.js");
});

app.get("/SingleNotch.obj", function(request, response) {
  response.sendFile(__dirname + "/SingleNotch.obj");
});


// listen for requests :)
const listener = app.listen(process.env.PORT, function() {
  console.log("Your app is listening on port " + listener.address().port);
});
