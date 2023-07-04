const express = require("express");
const mongoose = require("mongoose")
const registerValidation = require('./validations/auth.js')
const postCreateValidation = require('./validations/post.js')
const checkAuth = require('./utils/checkAuth.js')
const UserController = require('./controllers/UserController.js')
const PostController = require('./controllers/PostController.js')
const multer = require('multer')

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
app.use('/uploads', express.static('uploads'))

const storage = multer.diskStorage({
    destination: (_, __, cb) => {
        cb(null, 'uploads')
    },
    filename: (_, file, cb) => {
        cb(null, file.originalname)
    },
})

const upload = multer({ storage });

app.get('/auth/me', checkAuth, UserController.getMe)
app.post('/auth/register', registerValidation, UserController.register);
app.post('/auth/login', UserController.login)

app.post('/upload',checkAuth, upload.single('image'), (req, res) => {
    res.json({
        url: `/uploads/${req.file.originalname}`
    })
})

app.get('/posts', PostController.getAll)
app.get('/posts/:id', PostController.getOne)
app.post('/posts', checkAuth, postCreateValidation, PostController.create)
app.delete('/posts/:id', checkAuth, PostController.remove)
app.patch('/posts/:id', postCreateValidation, PostController.update)


app.listen(3000, (err) => {
    if (err) {
        return console.log(err);
    }
    console.log('Server OK')
})