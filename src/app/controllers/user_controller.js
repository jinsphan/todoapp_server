const bcrypt               = require("bcrypt");
const jwt                  = require("jsonwebtoken");
const isEmpty              = require("lodash").isEmpty;
const KEY_SECRET           = require("../../config.js").KEY_SECRET;
const { utils, validator } = require("../../lib");

const userModel            = require("../models/users");
const saltRounds           = 10;

// -------------- User Controller -------------

const login = (req, res) => {
  if (req.body.type === "facebook") {
    loginWithFacebook(req.body.user, (status, data) => {
      res.status(status).json(data);
    })
    return;
  }
  loginNormaly(req.body, (status, data) => {
    res.status(status).json(data);
  });
}

const loginNormaly = (user, callback) => {
  const vld = validator._validateForm({
    email: user.email || "",
    password: user.password || ""
  });
  if (!vld.check) {
    callback(400, vld.errors);
  } else {
    userModel.getUserByEmail(user.email, (er, _user) => {
      if(_user) {
        if (_user.status !== 1) {
          callback(404, {email: "Email inactive!"});
        } else {
          bcrypt.compare(user.password, _user.password, (er, check) => {
            if (check) {
              callback(200, {token: _jwtGenerate(_user)});
            } else {
              callback(404, {password: "Password incorrect!"});
            }
          })
        }
      } else {
        callback(404, {email: "Email incorrect!"});
      }
    })
  }
}

const loginWithFacebook = (userFB, callback) => {
  userModel.getUserByEmail(userFB.email, (er, user) => {
    if (user) {
      userModel.updateUser(user.id, {status: 1, fullname: userFB.fullname}, (er, result) => {
        if (result.affectedRows === 1) {
          const userGenerate = {
            ...user,
            status: 1,
            fullname: userFB.fullname,
          };
          const token = _jwtGenerate(userGenerate);
          callback(200, {token});
        } else {
          callback(400, {error: "Bad request"});
        }
      })
    } else {
      const newUser = {
        ...userFB,
        password: userFB.id,
        role: 2,
        status: 1
      };
      userModel.addUser(newUser, (er, userAdded) => {
        if (er) callback(404, {error: "Cant not add user to database"});
        else {
          callback(200, {
            token: _jwtGenerate(userAdded)
          })
        }
      })
    }
  })
}

const register = async (req, res) => {
  const vld = validator._validateForm(req.body);
  if (!vld.check) {
    res.status(400);
    res.json(vld.errors);
  } else {
    const user = {
      ...req.body,
      role: 2,
      status: 0,
    };
    userModel.getUserByEmail(user.email, (er, userGetted) => {
      if (er) {
        bcrypt.hash(user.password, saltRounds, (er, hash) => {
          user.password = hash;
          userModel.addUser(user, (er, result) => {
            if (er) {
              res.status(401);
              res.send("Cant not add user!");
            } else {
              const userToSendMail = {
                ...result,
                token: _jwtGenerate(result),
              };
              utils.sendMail(userToSendMail, "confirm", (st, mes) => {
                res.status(st).send(mes);
              });
            }
          })
        }, KEY_SECRET);
      } else {
        res.status(409);
        res.json({email: "Someone already has that email!"});
      }
    })
  }
}

const forgotPassword = (req, res) => {
  const vld = validator._validateForm({email: req.params.email});
  if (!vld.check) {
    res.status(400).json(vld.errors);
  } else {
    userModel.getUserByEmail(req.params.email, (er, user) => {
      if (user) {
        const userToSendMail = {
          ...user,
          token: _jwtGenerate(user, false),
        };
        utils.sendMail(userToSendMail, "changepassword", st => {
          res.status(st);
          res.send("Check your email to change password!");
        });
      } else {
        res.status(400).json({email: "Email not available!"});
      }
    })
  }
}

const changePassword = (req, res) => {
  if (req.body.password === '') {
    res.status(400).json({password: "Password can not empty!"});
  } else if (req.body.password !== req.body.cfpassword) {
    res.status(400).json({cfpassword: "Password confirm incorrect!"});
  } else {
    bcrypt.hash(req.body.password, saltRounds, (er, hash) => {
      userModel.changePassword(req.payload.id, {password: hash}, (er, result) => {
        if (er) {
          res.status(401).send("Unthorization");
        } else if (result.affectedRows === 0) {
          res.status(500).send("Error update user");
        } else {
          res.status(200).json({
            token: _jwtGenerate(req.payload),
          });
        }
      })
    })
  }
}

const confirmAccount = (req, res) => {
  userModel.getUserByEmail(req.payload.email, (er, user) => {
    if (user) {
      if (user.status === 0) {
        userModel.updateUser(user.id, {status: 1}, (er, result) => {
          if (er) {
            res.status(401);
            res.send("Unauthoriazion");
          } else if(result.affectedRows > 0){
            user.status = 1;
            res.status(200).json({
              token: _jwtGenerate(user),
            });
          } else {
            res.status(400);
            res.send("Cant not update status!");
          }
        })
      } else {
        res.status(401);
        res.send("Now Allowed!");
      }
    } else {
      res.status(404);
      res.send("Not Found");
    }
  })
}

const checkAuthSuccess = (req, res) => {
  userModel.getUserByEmail(req.payload.email, (er, user) => {
    if (user.status !== 1) {
      res.status(401);
      res.send("UnAuthorization");
    } else {
      res.status(200);
      res.send("Authentiation.");
    }
  })
}

const _jwtGenerate = (user, isAllowLogin = true) => {
  return jwt.sign({
    id: user.id,
    email: user.email,
    fullname: user.fullname,
    role: user.role,
    status: user.status,
    isAllowLogin,
  }, KEY_SECRET)
}

module.exports = {
  login,
  register,
  confirmAccount,
  checkAuthSuccess,
  forgotPassword,
  changePassword,
}