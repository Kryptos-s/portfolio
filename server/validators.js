const { body, validationResult } = require('express-validator');

const contactValidationRules = () => {
  return [
    // Name: min 5, max 128
    body('name').trim().isLength({ min: 5, max: 128 }).escape(),
    
    // Email: Valid email, max 256
    body('email').trim().isEmail().isLength({ max: 256 }).normalizeEmail(),
    
    // Phone: Optional, min 7
    body('phone').optional({ checkFalsy: true }).trim().isLength({ min: 7 }).escape(),
    
    // Subject: min 3, max 128
    body('subject').trim().isLength({ min: 3, max: 128 }).escape(),
    
    // Message: min 5
    body('message').trim().isLength({ min: 5 }).escape(),
  ]
}

const validate = (req, res, next) => {
  const errors = validationResult(req);
  if (errors.isEmpty()) return next();
  return res.status(400).json({ success: false, errors: errors.array() });
}

module.exports = { contactValidationRules, validate };