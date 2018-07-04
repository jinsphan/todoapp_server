const app = require("./app");

app.set("port", process.env.PORT || 3001);
const server = app.listen(app.get("port"), () => {
  console.log("App Listening on Port: " + server.address().port);
});
