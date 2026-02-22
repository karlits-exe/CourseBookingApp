const bcrypt = require("bcrypt");
const User = require("../models/User");
const Enrollment = require("../models/Enrollment");
const auth = require("../auth");

const { errorHandler } = auth;

module.exports.enroll = (req, res) => {
  console.log(req.user.id);
  console.log(req.body.enrolledCourses);

  if (req.user.isAdmin) {
    return res.status(403).send({ message: "Admin is forbidden" });
  }
  return Enrollment.findOne({ userId: req.user.id })
    .then((existingEnrollment) => {
      if (existingEnrollment) {
        return res.status(409).send({ message: "User already enrolled" });
      }

      let newEnrollment = new Enrollment({
        userId: req.user.id,
        enrolledCourses: req.body.enrolledCourses,
        totalPrice: req.body.totalPrice,
      });

      return newEnrollment.save().then((enrolled) => {
        return res
          .status(201)
          .send({ success: true, message: "Enrolled successfully" });
      });
    })
    .catch((error) => errorHandler(error, req, res));
};


