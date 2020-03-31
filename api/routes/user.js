const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');

// import user model
const User = require('./models/user');
// New User Sign up route
router.post('/signup', (req, res, nex) => {
    const user = new User({
        _id: new mongoose.Types.ObjectId(),
        email: req.body.email,
        password: req.body.password
    })
});
// Sign in route


module.exports = router;