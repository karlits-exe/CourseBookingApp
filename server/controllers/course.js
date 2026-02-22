//[SECTION] Activity: Dependencies and Modules
const Course = require("../models/Course");
const mongoose = require("mongoose");
const { errorHandler } = require("../auth");

module.exports.addCourse = (req, res) => {
  let newCourse = new Course({
    name: req.body.name,
    description: req.body.description,
    price: req.body.price,
  });

  Course.findOne({ name: req.body.name })
    .then((existingCourse) => {
      if (existingCourse) {
        return res.status(409).send(true);
      } else {
        return newCourse
          .save()
          .then((result) => res.status(201).send(result))
          .catch((error) => errorHandler(error, req, res));
      }
    })
    .catch((error) => errorHandler(error, req, res));
};

// Updated getAllCourses Controller
module.exports.getAllCourses = (req, res) => {
  Course.find({})
    .then((allCourses) => {
      if (allCourses.length > 0) {
        return res.status(200).send(allCourses);
      } else {
        return res.status(404).send(false);
      }
    })
    .catch((error) => errorHandler(error, req, res));
};

module.exports.getAllActive = (req, res) => {
  Course.find({ isActive: true })
    .then((result) => {
      if (result.length > 0) {
        return res.status(200).send(result);
      }
      else {
        return res.status(404).send({ message: "No active courses found" });
      }
    })
    .catch((err) => res.status(500).send(err));
};

module.exports.getCourse = (req, res) => {
  if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
    return res.status(404).send({ message: "Course not found" });
  }

  return Course.findById(req.params.id)
    .then((course) => {
      if (course) {
        return res.status(200).send(course);
      } else {
        return res.status(404).send({ message: "Course not found" });
      }
    })
    .catch((error) => errorHandler(error, req, res));
};

//[SECTION] Update a course
/*
    Steps: 
    1. Create an object containing the data from the request body
    2. Retrieve and update a course using the mongoose "findByIdAndUpdate" method, passing the ID of the record to be updated as the first argument and an object containing the updates to the course
    3. Use the "then" method to send a response back to the client appliction based on the result of the "find" method
*/
// updateCourse controller
module.exports.updateCourse = (req, res) => {
  let updatedCourse = {
    name: req.body.name,
    description: req.body.description,
    price: req.body.price,
  };

  return Course.findByIdAndUpdate(req.params.courseId, updatedCourse)
    .then((course) => {
      if (course) {
        res.status(200).send({
          success: true,
          message: 'Course updated successfully'
        });
      } else {
        res.status(404).send({message: 'Course not found'});
      }
    })
    .catch((error) => errorHandler(error, req, res));
};

// archiveCourse controller
module.exports.archiveCourse = (req, res) => {
  
    let updateActiveField = {
        isActive: false
    };

    Course.findByIdAndUpdate(req.params.courseId, updateActiveField)
        .then(course => {
            if (course) {
                if (!course.isActive) {
                    return res.status(200).send({
                      message: 'Course already archived',
                      course: course
                    });
                }
                return res.status(200).send({
                  success: true,
                  message: 'Course archived successfully'
                });
            } else {
                return res.status(404).send({message: 'Course not found'});
            }
        })
        .catch(error => errorHandler(error, req, res));
};

module.exports.activateCourse = (req, res) => {
  if (!mongoose.Types.ObjectId.isValid(req.params.courseId)) {
    return res.status(404).send(false);
  }
  return Course.findById(req.params.courseId)
    .then((course) => {
      // if (!course) {
      if (course == null) {
        return res.status(404).send(false);
      }

      // if (course.isActive) {
      if (course.isActive == true) {
        return res.status(200).send({ message: "Course already activated" });
      }

      return Course.findByIdAndUpdate(req.params.courseId, {
        isActive: true,
      }).then((result) => res.status(200).send(true));
    })
    .catch((error) => errorHandler(error, req, res));
};
