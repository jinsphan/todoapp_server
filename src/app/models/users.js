var con = require("./index");
var utils = require("./utils");
const getUserByEmail = (email, callback) => {
  const statement = "SELECT * FROM users WHERE email = ?";
  con.getConnection((err, sql) => {
    sql.query(statement, [email], (er, result) => {
      if (er || result.length === 0) callback(true, null);
      else callback(null, result[0]);
    })
  })
}

const addUser = (user, cb) => {
  const statement = "INSERT INTO users (email, password, fullname, role, status) VALUES (?, ?, ?, ?, ?)";
  con.getConnection((err, sql) => {
    sql.query(statement, [user.email, user.password, user.fullname, user.role, user.status], (er, result) => {
      if (er) cb(er, null);
      else {
        getUserByEmail(user.email, (er, user) => {
          if (er) cb(er, null);
          else cb(null, user);
        })
      }
    })
  })
}

const updateUser = (user_id, field, cb) => {
  const statement = utils.getUpdateStatement("users", user_id, field);
  con.getConnection((err, sql) => {
    sql.query(statement, (er, result) => {
      if (er) cb(er, null);
      else cb(null, result);
    })
  })
}

const changePassword = (id, field, cb) => {
  const statement = utils.getUpdateStatement("users", id, field);
  con.getConnection((err, sql) => {
    sql.query(statement, (er, result) => {
      if (er) cb(er, null);
      else cb(null, result);
    })
  })
}

module.exports = {
  getUserByEmail,
  addUser,
  updateUser,
  changePassword,
}