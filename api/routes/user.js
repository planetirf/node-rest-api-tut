const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

// import user model
const User = require('../models/user');
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

router.post('/login', (req, res, next) => {
    User.findOne({email: req.body.email})
        .exec()
        .then(user => {
            if (!user) {
                return res.status(401).json({
                    message: 'Auth Failed'
                });
            }
            bcrypt.compare(req.body.password, user.password, (err, result) => {
                if (err) {
                    return res.status(401).json({
                        message: 'Auth Failed'
                    });
                }
                if (result) {
                    return res.status(200).json({
                        message: 'Auth Successful'
                    });
                }
                return res.status(401).json({
                    message: 'Auth Failed'
                });
            });
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({
                error: err
            });
        });
});

// Delete singup

router.delete('/:userId', (req, res, next) => {
    User.deleteOne({_id: req.params.userId})
        .exec()
        .then(result => {
            res.status(200).json({
                message: 'User Deleted'
            });
        })
        .catch(err => {
            res.status(500).json({
                error: err  
            });
        });
})


module.exports = router;