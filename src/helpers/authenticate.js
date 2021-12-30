const helpers = {};
//Prevent unregistered users from viewing the notes of registered users
helpers.isAuthenticated = (req, res, next) => {
    if (req.isAuthenticated()) {
        return next();
    }
    req.flash('error_msg', 'Not Authorized');
    res.redirect('/users/signin');
}

module.exports = helpers;
