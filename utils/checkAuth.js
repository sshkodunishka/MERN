const jwt = require('jsonwebtoken')

module.exports = (req, res, next) => {
    const token = (req.headers.authorization || '').replace(/Bearer\s?/, '');
    if (token) {
        try {
            const decodedToken = jwt.verify(token, 'secret123');
            req.userId = decodedToken._id;
            next();
        } catch (err) {
            return res.status(403).json({
                message: 'No access'
            });
        }
    } else {
        return res.status(403).json({
            message: 'No access'
        });
    }
}