const jwtStrategy = require('passport-jwt').Strategy;
const extractJwt = require('passport-jwt').ExtractJwt;
const User = require('../models/userModel');
const config = require('./databaseConfig');

module.exports = function (passport) {
    let opts = {};
    opts.jwtFromRequest = extractJwt.fromAuthHeaderAsBearerToken();
    opts.secretOrKey = config.secret;
    passport.use(new jwtStrategy(opts, (jwt_payload, done) => {

        User.getUserByCed(jwt_payload.data.ced, (err, user) => {

            if (err) {
                return done(err, false);
            }

            if (user) {
                return done(null, user);
            } else {
                return done(null, false);
            }
        });
    }));
}