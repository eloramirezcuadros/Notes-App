const express = require('express');
const router = express.Router();
const User = require('../models/User');
const passport = require('passport');

router.get('/users/signin', (req, res) => {
    res.render('users/signin');
});
//Authentication
router.post('/users/signin', passport.authenticate('local', {
    successRedirect: '/notes',
    failureRedirect: '/users/signin',
    failureFlash: true
}));

router.get('/users/signup', (req, res) => {
    res.render('users/signup');
});
//Check that a name is added in the requested field, that passwords match, that the password is longer than 4 digits.
router.post('/users/signup', async(req, res) => {
    const { name, email, password, confirm_password } = req.body;
    const errors = [];
    if (name.length <= 0) {
        errors.push({ text: 'Please, insert name' });
    }
    if (password != confirm_password) {
        errors.push({ text: 'Passwords do not match' });
    }
    if (password.length < 5) {
        errors.push({ text: 'Insecure password' });
    }
    if (errors.length > 0) {
        res.render('users/signup', { errors, name, email, password, confirm_password });
    } else {
        //To prevent the creation of identical emails
        const emailUser = await User.findOne({ email: email });
        if (emailUser) {
            req.flash('error_msg', 'This email already exists');
            res.redirect('/users/signup');
        }
        //To replace the password with the encrypted password
        const newUser = new User({ name, email, password });
        newUser.password = await newUser.encryptPassword(password);
        await newUser.save();
        req.flash('success_msg', 'You are registered');
        res.redirect('/users/signin');
    }
});
//logout route
router.get('/users/logout', (req, res) => {
    req.logout();
    res.redirect('/');
})

module.exports = router;
