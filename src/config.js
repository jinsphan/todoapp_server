// const db = {
//   DB_HOST: "localhost",
//   DB_USER: "root",
//   DB_PASSWORD: "root",
//   DB_NAME: "todo_app"
// }

// Heroku database
const db = {
  DB_HOST: "us-cdbr-iron-east-04.cleardb.net",
  DB_USER: "b4c784f4544171",
  DB_PASSWORD: "019a57d5",
  DB_NAME: "heroku_1e924cf50a27242"
}
const mail = {
  SERVICE: "gmail",
  USER_EMAIL: "todoapp.bkdn@gmail.com",
  PASS_EMAIL: "jrtinhGM001",
}

const KEY_SECRET = "jrtinh";
let BASE_URL = "http://localhost:3000";

if (process.env.NODE_ENV == "production") {
  BASE_URL = "https://jinsphan-todoapp.herokuapp.com/"
}

module.exports = {
  db,
  mail,
  KEY_SECRET,
  BASE_URL,
}