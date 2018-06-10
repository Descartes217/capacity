const router = require('express').Router();
const passport = require('passport');
const jwt = require('jsonwebtoken');

// import model
const User = require('../models/userModel');
// import config
const config = require('../config/databaseConfig');

//routes
router.post('/register', (req, res, next) => {

    let newUser = new User({
        names: req.body.names,
        lastNames: req.body.lastNames,
        ced: req.body.ced,
        password: req.body.password,
        email: req.body.email,
    });

    User.addUser(newUser, (err, user) => {

        if (err) {
            res.json({
                success: false,
                msg: 'failed to register user',
                error: err.message
            });
        } else {
            res.json({
                success: true,
                msg: 'User registered'
            });
        }
    });
});

router.post('/auth', (req, res, next) => {
    const ced = req.body.ced;
    const password = req.body.password;

    User.getUserByCed(ced, (err, user) => {

        if (err) throw err;

        if (!user) {
            return res.json({
                success: false,
                msg: 'User not found'
            });
        }

        User.comparePassword(password, user.password, (err, isMatch) => {

            if (err) throw err;

            if (isMatch) {
                const token = jwt.sign({
                    data: user
                }, config.secret, {
                    expiresIn: 604800
                });

                res.json({
                    success: true,
                    token: 'bearer ' + token,
                    user: {
                        ced: user.ced,
                        name: user.name,
                        email: user.email
                    }
                });
            } else {
                return res.json({
                    success: false,
                    msg: 'Wrong password'
                });
            }
        });
    });
});

router.get('/profile', passport.authenticate('jwt', {
    session: false
}), (req, res, next) => {
    res.json({
        user: req.user
    });
});

//exportar el modulo
module.exports = router;