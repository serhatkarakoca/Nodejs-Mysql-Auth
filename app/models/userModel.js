const sql = require("./db.js");
const bcrypt = require('bcrypt');
const helpers = require("../helpers/helpers.js");

// constructor
const User = function (user) {
  this.first_name = user.first_name;
  this.last_name = user.last_name;
  this.email = user.email;
  this.password = user.password;
  this.phone_number = user.phone_number;
  this.gender = user.gender;
  this.latitude = user.latitude;
  this.longitude = user.longitude;
  this.birthday = user.birthday;
  this.interested_in = user.interested_in;
};


User.register = (newUser, result) => {

  sql.query("Select * from users where email = ?", newUser.email, (err, res) => {
    if (err) {
      return result(err, null)
    }
    if (res[0] != null) {
      return result({
        success: false,
        message: "There is a user with this email please log in",
        error: "DuplicateUidError",
        error_description: "DuplicateUidError"
      }, null);
    } else {
      newUser.password = bcrypt.hashSync(newUser.password, 10);
      sql.query("INSERT INTO users SET ?", newUser, (err, res) => {
        if (err) {
          console.log("error: ", err);
          return result(err, null);

        }

        return result(null, { id: res.insertId, ...newUser });
      });
    }
  });

};

User.login = (email, password, result) => {
  sql.query("Select * from users where email = ?", email, (err, res) => {
    if (err) {
      return result(err, null)
    }
    if (res[0] != null) {
      var rows = JSON.parse(JSON.stringify(res[0]));
      let validatePass = bcrypt.compareSync(password, rows.password);
      if (validatePass)
        return result(null, { success: true, message: "Login Success" });
      else
        return result({
          success: false,
          message: "E-mail or password is not correct, please try again.",
          error: "BadCredentials",
          error_description: "BadCredentials"
        }, null);
    } else {
      return result({
        success: false,
        message: "There no user with this email please register",
        error: "NOUSER",
        error_description: "NOUSER"
      }, null);
    }
  });
};

module.exports = User;