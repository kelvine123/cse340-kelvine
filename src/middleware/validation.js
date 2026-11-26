import { body, validationResult } from 'express-validator';

const requiredText = (field, label, max) => body(field)
  .isString().withMessage(`Enter ${label}.`).bail()
  .trim()
  .notEmpty().withMessage(`Enter ${label}.`).bail()
  .isLength({ min: 1, max }).withMessage(`${label} must be ${max} characters or fewer.`);

export const registerValidation = [
  requiredText('first_name', 'a first name', 100),
  requiredText('last_name', 'a last name', 100),
  body('username')
    .isString().withMessage('Enter a valid email address.').bail()
    .trim()
    .notEmpty().withMessage('Enter a valid email address.').bail()
    .isEmail().withMessage('Enter a valid email address.')
    .bail()
    .isLength({ max: 254 }).withMessage('Email address must be 254 characters or fewer.'),
  body('password')
    .isString().withMessage('Enter a password.').bail()
    .notEmpty().withMessage('Enter a password.').bail()
    .isLength({ min: 8 }).withMessage('Password must be at least 8 characters.'),
];

export const loginValidation = [
  body('username')
    .isString().withMessage('Enter a valid email address.').bail()
    .trim()
    .notEmpty().withMessage('Enter a valid email address.').bail()
    .isEmail().withMessage('Enter a valid email address.')
    .bail()
    .isLength({ max: 254 }).withMessage('Email address must be 254 characters or fewer.'),
  body('password')
    .isString().withMessage('Enter a password.').bail()
    .notEmpty().withMessage('Enter a password.'),
];

export const categoryValidation = [
  requiredText('category_name', 'a category name', 100)
    .isLength({ min: 3, max: 100 })
    .withMessage('Category name must be between 3 and 100 characters.'),
];

export const organizationValidation = [
  body('organization_name')
    .isString().withMessage('Enter an organization name.').bail()
    .trim()
    .notEmpty().withMessage('Enter an organization name.').bail()
    .isLength({ min: 3, max: 150 })
    .withMessage('Organization name must be between 3 and 150 characters.'),
  body('description')
    .isString().withMessage('Enter a description of at least 3 characters.').bail()
    .trim()
    .notEmpty().withMessage('Enter a description of at least 3 characters.').bail()
    .isLength({ min: 3 }).withMessage('Enter a description of at least 3 characters.'),
  body('contact_email')
    .isString().withMessage('Enter a valid contact email address.').bail()
    .trim()
    .notEmpty().withMessage('Enter a valid contact email address.').bail()
    .isEmail().withMessage('Enter a valid contact email address.')
    .bail()
    .isLength({ max: 254 })
    .withMessage('Contact email must be 254 characters or fewer.'),
  body('logo')
    .optional({ checkFalsy: true })
    .isString().withMessage('Enter a valid logo URL.').bail()
    .trim()
    .isURL({ require_protocol: true }).withMessage('Enter a valid logo URL.'),
];

export const projectValidation = [
  body('project_name')
    .isString().withMessage('Enter a project name.').bail()
    .trim()
    .notEmpty().withMessage('Enter a project name.').bail()
    .isLength({ min: 3, max: 150 })
    .withMessage('Project name must be between 3 and 150 characters.'),
  body('description')
    .isString().withMessage('Enter a description of at least 3 characters.').bail()
    .trim()
    .notEmpty().withMessage('Enter a description of at least 3 characters.').bail()
    .isLength({ min: 3 }).withMessage('Enter a description of at least 3 characters.'),
  body('project_date')
    .isString().withMessage('Choose a valid project date.').bail()
    .trim()
    .notEmpty().withMessage('Choose a valid project date.').bail()
    .isISO8601({ strict: true, strictSeparator: true })
    .withMessage('Choose a valid project date.'),
  body('location')
    .isString().withMessage('Enter a project location.').bail()
    .trim()
    .notEmpty().withMessage('Enter a project location.').bail()
    .isLength({ max: 255 }).withMessage('Location must be 255 characters or fewer.'),
  body('organization_id')
    .isString().withMessage('Choose an organization.').bail()
    .trim()
    .notEmpty().withMessage('Choose an organization.').bail()
    .isInt({ min: 1 }).withMessage('Choose an organization.'),
  body('category_ids')
    .optional({ checkFalsy: true })
    .custom((value) => {
      const ids = Array.isArray(value) ? value : [value];
      return ids.every((id) => typeof id === 'string' && /^\d+$/.test(id) && Number(id) > 0);
    })
    .withMessage('Choose valid project categories.'),
];

export const getValidationErrors = (request) => (
  validationResult(request).array().reduce((errors, error) => {
    if (!errors[error.path]) {
      errors[error.path] = error.msg;
    }
    return errors;
  }, {})
);
