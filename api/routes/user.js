const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const checkAuth = require('../middleware/check-auth')

// import user model
const User = require('../models/user');
const UserController = require('../controllers/user');
// New User Sign up route
router.post('/signup', (req, res, next) => {
    User.findOne({email: req.body.email})
        .exec()
        .then(user => {
            if (user) {
                return res.status(422).json({
                    message: "User already exists"
                });
            } else {
                bcrypt.hash(req.body.password, 10, (err, hash) => {
                    if (err) {
                        return res.status(500).json({
                            return: err
                        });
                    } else {
                        const user = new User({
                            _id: new mongoose.Types.ObjectId(),
                            email: req.body.email,
                            password: hash
                        });
                        user.save()
                        .then(result => {
                            console.log(result);
                            res.status(201).json({
                                message: 'User Created'
                            });
                        })
                        .catch(err => {
                            res.status(500).json({
                              error: err
                            });
                        });
                    }
                })
            }
        })

});

// User Login
router.post('/login', UserController.user_login);

// Delete singup
router.delete('/:userId', checkAuth, UserController.user_delete)


module.exports = router;