const express = require("express");
const mongoose = require("mongoose")
const registerValidation = require('./validations/auth.js')
const checkAuth = require('./utils/checkAuth.js')
const UserController = require('./controllers/UserController.js')

const app = express();

mongoose.connect('mongodb://127.0.0.1:27017/MERN', {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
    .then(() => {
        console.log('DB connected')
    }).catch((err) => {
        console.log('DB error ', err)
    })

app.use(express.json())

app.get('/auth/me', checkAuth, UserController.getMe)
app.post('/auth/register', registerValidation, UserController.register);
app.post('/auth/login', UserController.login)

app.listen(3000, (err) => {
    if (err) {
        return console.log(err);
    }
    console.log('Server OK')
})