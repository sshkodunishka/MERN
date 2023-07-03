const jwt = require("jsonwebtoken")
const { validationResult } = require('express-validator')
const bcrypt = require('bcrypt')
const UserModel = require('../models/user.js')

module.exports = {
    register: async (req, res) => {
        try {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return res.status(400).json(errors.array());
            }

            const password = req.body.password;
            const salt = await bcrypt.genSalt(10);
            const hash = await bcrypt.hash(password, salt)

            const newUser = new UserModel({
                email: req.body.email,
                fullName: req.body.fullName,
                avatarUrl: req.body.avatarUrl,
                passwordHash: hash
            })

            await newUser.save()

            const token = jwt.sign({
                _id: newUser._id,
            },
                'secret123',
                {
                    expiresIn: '30d'
                })

            const { passwordHash, ...userData } = newUser._doc;

            res.json({ ...userData, token })
        } catch (err) {
            console.log(err)
            res.status(500).json({
                message: 'Failed to register '
            });
        }
    },
    login: async (req, res) => {
        try {
            const user = await UserModel.findOne({ email: req.body.email });

            if (!user) {
                return res.status(404).json({
                    message: 'User not found'
                })
            }

            const isValidPass = await bcrypt.compare(req.body.password, user._doc.passwordHash);
            if (!isValidPass) {
                return res.status(404).json({
                    message: 'Failed email or password'
                });
            }

            const token = jwt.sign({
                _id: user._id,
            },
                'secret123',
                {
                    expiresIn: '30d'
                })
            const { passwordHash, ...userData } = user._doc;
            res.json({ ...userData, token })
        } catch (err) {
            console.log(err)
            res.status(500).json({
                message: 'Failed to login '
            });
        }
    },
    getMe: async (req, res) => {
        try {
            const user = await UserModel.findById(req.userId);
            if (!user) {
                return res.status(404).json({
                    message: 'User not found'
                })
            }
            const { passwordHash, ...userData } = user._doc;
            res.json({ userData })
        } catch (err) {
            return res.status(403).json({
                message: 'No access'
            });
        }
    }
}