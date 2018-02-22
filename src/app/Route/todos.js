var router = require("express").Router();
var express_jwt = require("express-jwt");
const KEY_SECRET = require("../../config").KEY_SECRET;
const auth = express_jwt({
  secret: KEY_SECRET,
  userProperty: "payload",
})

var ctrlTodo = require("../controllers/todo_controller");

router.get("/", auth, ctrlTodo.getTodosByUser);
router.post("/", auth, ctrlTodo.addTodo);
router.delete("/", auth, ctrlTodo.deleteTodos);
router.put("/done", auth, ctrlTodo.checkedTodo);

module.exports = router;