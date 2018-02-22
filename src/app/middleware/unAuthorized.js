module.exports = (err, req, res, next) => {
  if(err.name === "UnauthorizedError") {
    res.status(401).send("Invalid token...");
  }
}