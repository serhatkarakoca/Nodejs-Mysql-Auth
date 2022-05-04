const express = require("express");
const User = require("../models/userModel");

exports.register = async (req, res) => {
  // Validate request
  if (!req.body) {
    return res.status(400).json({
      message: "Content can not be empty!"
    });
  }

  // Create a User
  const register = new User({
    first_name: req.body.first_name,
    last_name: req.body.last_name,
    email: req.body.email,
    password: req.body.password,
    phone_number: req.body.phone_number,
    gender: req.body.gender,
    latitude: req.body.latitude,
    longitude: req.body.longitude,
    birthday: req.body.birthday,
    interested_in: req.body.interested_in || true,
  });

  try {
    await User.register(register, (err, data) => {
      if (err) {
        if (err.error === "DuplicateUidError") {
          return res.status(404).json(err);
        } else
          return res.status(500).json({
            message:
              err.message || "Some error occurred while creating the User."
          });

      }
      else return res.status(201).json(data);
    });
  } catch (err) {
    return res.status(500).json({ msg: 'Internal server error' });
  }
  // Save User in the database

};


exports.login = async (req, res) => {
  try {
    await User.login(req.query.email, req.query.password, (err, data) => {
      if (err) {
        if (err.error === "BadCredentials") {
          return res.status(404).json(err);
        } else if (err.error === "NOUSER") {
          return res.status(404).json(err);
        } else
          return res.status(500).json({
            message:
              err.message || "Some error occurred while creating the User."
          });

      }
      else return res.status(200).json(data);
    });
  } catch (err) {
    return express.status(500).json({ msg: 'Internal server error' });
  }
}