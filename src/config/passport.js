const passport = require('passport');
const localStrategy = require('passport-local').Strategy;
const User = require('../models/User');

//Validate email and password
passport.use(new localStrategy({
    usernameField: 'email'
}, async(email, password, done) => {
    const user = await User.findOne({ email: email });
    if (!user) {
        return done(null, false, { message: 'Not User Found' });
    } else {
        const match = await user.matchPassword(password);
        if (match) {
            return done(null, user);
        } else {
            return done(null, false, { message: 'Incorrect Password' });
        }
    }
}));
//Store user ID
passport.serializeUser((user, done) => {
    done(null, user.id);
});

passport.deserializeUser((id, done) => {
    User.findById(id, (err, user) => {
        done(err, user);
    });
});
