const { body } = require('express-validator')

module.exports = registerValidation = [
    body('email').isEmail(),
    body('password').isLength({ min: 5 }),
    body('fullName').isLength({ min: 5 }),
    body('avatarUrl').optional().isURL(),
]