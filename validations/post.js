const { body } = require('express-validator')

module.exports = postCreateValidation = [
    body('title').isLength({ min: 3 }).isString(),
    body('text').isLength({ min: 10 }).isString(),
    body('tags').optional().isString(),
    body('imageUrl').optional().isString(),
]