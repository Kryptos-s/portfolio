const { body, validationResult } = require('express-validator');

const contactValidationRules = () => {
  return [
    body('name').trim().isLength({ min: 5, max: 128 }).escape(),
    body('email').trim().isEmail().isLength({ max: 256 }).normalizeEmail(),
    body('phone')
      .optional({ checkFalsy: true })
      .trim()
      .isLength({ min: 7, max: 32 })
      .matches(/^[+\d][\d\s()\-]{6,31}$/).withMessage('Invalid phone format')
      .escape(),
    body('subject').trim().isLength({ min: 3, max: 128 }).escape(),
    body('message').trim().isLength({ min: 5, max: 5000 }).escape(),
  ];
};

const validate = (req, res, next) => {
  const errors = validationResult(req);
  if (errors.isEmpty()) return next();
  return res.status(400).json({ success: false, errors: errors.array() });
};

module.exports = { contactValidationRules, validate };
