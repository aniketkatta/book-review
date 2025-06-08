const express = require("express");
const { body } = require("express-validator");
const router = express.Router();
const userController = require("../controllers/userController");

router.post(
  "/signup",
  [
    body("email").isEmail().withMessage("Invalid Email"),
    body("fullName.firstName")
      .isLength({ min: 2 })
      .withMessage("First Name must be atleast 2 characters long"),
    body("fullName.lastName")
      .isLength({ min: 2 })
      .withMessage("Last Name must be atleast 2 characters long"),
    body("password")
      .isLength({ min: 8 })
      .withMessage("Password must be atleast 8 characters long"),
  ],
  userController.registerUser
);

router.post(
  "/login",
  [
    body("email").isEmail().withMessage("Invalid Email"),
    body("password")
      .isLength({ min: 8 })
      .withMessage("Password must be atleast 8 character long"),
  ],
  userController.loginUser
);


module.exports = router;
