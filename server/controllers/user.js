//[SECTION] Dependencies and Modules
const User = require("../models/User");
const Enrollment = require("../models/Enrollment");
// bcrypt is one of the many packages that we can use to encrypt strings or passwords
const bcrypt = require("bcrypt");

const auth = require("../auth.js");

module.exports.checkEmailExists = (req, res) => {
  if (req.body.email.includes("@")) {
    return User.find({ email: req.body.email })
      .then((result) => {
        if (result.length > 0) {
          return res.status(409).send(true);
        } else {
          return res.status(404).send(false);
        }
      })
      .catch((error) => errorHandler(error, req, res));
  } else {
    res.status(400).send(false);
  }
};

module.exports.registerUser = (req, res) => {
  if (
    typeof req.body.firstName !== "string" ||
    typeof req.body.lastName !== "string"
  ) {
    return res.status(400).send(false);
  }

  if (req.body.mobileNo.length !== 11) {
    return res.status(400).send(false);
  }

  if (!req.body.email.includes("@")) {
    return res.status(400).send(false);
  }

  if (req.body.password.length < 8) {
    return res.status(400).send(false);
  }

  let newUser = new User({
    firstName: req.body.firstName,
    lastName: req.body.lastName,
    email: req.body.email,
    mobileNo: req.body.mobileNo,
    password: bcrypt.hashSync(req.body.password, 12),
  });

  return newUser
    .save()
    .then((result) => res.status(201).send(result))
    .catch((error) => errorHandler(error, req, res));
};

module.exports.loginUser = (req, res) => {
  if (req.body.email.includes("@")) {
    return User.findOne({ email: req.body.email })
      .then((result) => {
        if (result == null) {
          // Send status 404
          return res.status(404).send({ message: "No email found"});
        } else {
          const isPasswordCorrect = bcrypt.compareSync(
            req.body.password,
            result.password,
          );
          if (isPasswordCorrect) {
            //Send status 200
            return res
              .status(200)
              .send({ access: auth.createAccessToken(result),
                message: 'User logged in successfully'
               });
          } else {
            //Send status 401
            return res
              .status(401)
              .send({ message: "Incorrect email or password" });
          }
        }
      })
      .catch((error) => errorHandler(error, req, res));
  } else {
    return res.status(400).send({message: "Invalid email format"});
  }
};

module.exports.getProfile = (req, res) => {
  return User.findById(req.user.id)
    .then((user) => {
      user.password = "";
      return res.status(200).send(user);
    })
    .catch((error) => errorHandler(error, req, res));
};

module.exports.getEnrollments = (req, res) => {
  return Enrollment.find({ userId: req.user.id })
    .then((result) => {
      if (result.length === 0) {
        return res.status(404).send(false);
      } else {
        return res.status(200).send({ enrollments: result[0].enrolledCourses });
      }
    })
    .catch((error) => errorHandler(error, req, res));
};

