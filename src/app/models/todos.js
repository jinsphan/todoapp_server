var con = require("./index");
var utils = require("./utils");

const getTodosByUser = (user_id, callback) => {
  const statement = "SELECT * FROM todos WHERE user_id = ?";
  con.getConnection((err, sql) => {
    if (err) {
      console.log("ERROR", err);
      callback(true);
    } else {
      sql.query(statement, [user_id], (er, result) => {
        if (er || result.length === 0) callback(true);
        else callback(null, result);
      })
    }
  })
}

const getTodosById = (id, callback) => {
  const statement = "SELECT * FROM todos WHERE id = ?";
  con.getConnection((err, sql) => {
    sql.query(statement, [id], (er, result) => {
      if (er || result.length === 0) callback(true);
      else callback(null, result[0]);
    })
  })
}

const addTodo = (user_id, todo, callback) => {
  checkNameTodo(user_id, todo.name, check => {
    if (check) {
      const statement = "INSERT INTO todos (user_id, name, deadline) VALUES(?, ?, ?)";
      con.getConnection((err, sql) => {
        sql.query(statement, [user_id, todo.name, todo.deadline], (er, result) => {
          if (er) {
            callback(true);
          } else {
            getTodosByUser(user_id, (er, result) => {
              if (er) callback(true);
              else callback(null, result[result.length-1]);
            })
          }
        })
      })
    } else {
      callback(true);
    }
  })
}

const deleteTodos = (user_id, arId, callback) => {
  let statement = "DELETE FROM todos WHERE ";
  arId.forEach(todo_id => {
    statement += `id = '${todo_id}' OR `;
  });
  statement = statement.slice(0, statement.length-3);
  checkTodoAuth(user_id, arId, (er, result) => {
    if (er) callback(true);
    else {
      con.getConnection((er, sql) => {
        sql.query(statement, (er, result) => {
          if (er) callback(true);
          else callback(null, result);
        })
      })
    }
  })
}

checkNameTodo = (user_id, name, cb) => {
  const statement = "SELECT name FROM todos WHERE todos.user_id = ? AND todos.name = ?";
  con.getConnection((er, sql) => {
    sql.query(statement, [user_id, name], (er, result) => {
      if (er || result.length > 0) cb(false);
      else cb(true);
    })
  })
}

const checkedTodo = (user_id, todo_id, callback) => {
  statement = "UPDATE todos SET done = 1 - todos.done WHERE id = ?";
  checkTodoAuth(user_id, [todo_id], (er, result) => {
    if (er) callback(true);
    else {
      con.getConnection((er, sql) => {
        sql.query(statement, [todo_id], (er, result) => {
          console.log(er);
          if (er) callback(true);
          else callback(null, result);
        })
      })
    }
  })
}

const checkTodoAuth = (user_id, arId, callback) => {
  getTodosByUser(user_id, (er, result) => {
    if (er) callback(true);
    else {
      let check = true;
      const arTodoIdByUser = result.map(todo=>todo.id);
      arId.forEach(id => {
        if (!arTodoIdByUser.includes(id)) check = false;
      });
      callback(!check, callback);
    }
  })
}

module.exports = {
  getTodosByUser,
  addTodo,
  deleteTodos,
  checkedTodo,
}