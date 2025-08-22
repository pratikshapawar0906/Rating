const { body, query }= require("express-validator");

const PASSWORD_REGEX =
  /^(?=.*[A-Z])(?=.*[!@#$%^&*()_\-+=\[\]{};:'"\\|,.<>/?]).{8,16}$/;

exports.signupValidator = [
  body("name").isString().isLength({ min: 20, max: 60 }),
  body("email").isEmail(),
  body("address").optional().isLength({ max: 400 }),
  body("password").matches(PASSWORD_REGEX)
];

exports.addUserValidator = [
  body("name").isString().isLength({ min: 20, max: 60 }),
  body("email").isEmail(),
  body("address").optional().isLength({ max: 400 }),
  body("password").matches(PASSWORD_REGEX),
  body("role").isIn(["ADMIN", "USER", "OWNER"])
];

exports.loginValidator = [
  body("email").isEmail(),
  body("password").isString().isLength({ min: 8, max: 16 })
];

exports.changePasswordValidator = [
  body("oldPassword").isString().isLength({ min: 8, max: 16 }),
  body("newPassword").matches(PASSWORD_REGEX)
];

exports.createStoreValidator = [
  body("name").isString().isLength({ min: 2, max: 120 }),
  body("email").optional().isEmail(),
  body("address").optional().isLength({ max: 400 }),
  body("ownerId").optional().isString()
];

exports.ratingValidator = [
  body("storeId").isString(),
  body("score").isInt({ min: 1, max: 5 })
];

exports.listQueryValidator = [
  query("search").optional().isString(),
  query("sortBy").optional().isIn(["name","email","address","role","averageRating","ratingCount","createdAt"]),
  query("order").optional().isIn(["asc","desc"]),
  query("page").optional().isInt({ min: 1 }),
  query("limit").optional().isInt({ min: 1, max: 100 })
];
