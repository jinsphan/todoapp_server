const {
  _FirstUpperCase
} = require("../utils");

const patternForEmail = /^[a-zA-Z0-9]{1,}@[a-zA-Z0-9]{1,}\.[a-zA-Z0-9]{1,}$/;
const patternForPassword = /^[a-zA-Z0-9]{1,}$/;
const patternForText = /^[^\`|\~|\!|\@|\#|\$|\%|\^|\&|\*|\(|\)|\+|\=|\[|\{|\]|\}|\||\\|\'|\<|\>|\?|\/|\""|\;]+$/;

module.exports = (user) => {
  let errors = {};
  let check = true;

  Object.keys(user).forEach(key => {
    if (key === "email") {
      errors[key] = user[key].match(patternForEmail) === null ? `${_FirstUpperCase(key)} invalid!` : null;
    } else if (key === "password" || key === "confirm") {
      errors[key] = user[key].match(patternForPassword) === null ? `${_FirstUpperCase(key)} invalid!` : null;
      if (key === "confirm" && user[key] !== user.password) errors[key] = "Confirm incorrect!";
    } else {
      errors[key] = user[key].match(patternForText) === null ? `${_FirstUpperCase(key)} invalid!` : null;
    }
  });

  Object.keys(errors).forEach(key => {
    if (errors[key] !== null) {
      check = false;
    }
  })

  return {
    check,
    errors
  };
}