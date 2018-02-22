const mixins = require("./mixins");
const sendMail = require("./sendMail_utils");
module.exports = {
  ...mixins,
  sendMail,
}