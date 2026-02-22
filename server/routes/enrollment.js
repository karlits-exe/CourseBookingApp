const express = require("express");
const enrollmentController = require("../controllers/enrollment");
const auth = require("../auth");
const { verify, verifyAdmin } = auth;

const router = express.Router();

module.exports = router;
