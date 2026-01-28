import { body, validationResult } from "express-validator";
export const levelValidator = [
  body("level")
    .notEmpty()
    .withMessage("level is required")
    .isInt({ min: 0 })
    .withMessage("level must be a number ≥ 0"),
];
export const validate = (req, res, next) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(400).json({
      errors: errors.array(),
    });
  }

  next();
};