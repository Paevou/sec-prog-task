var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var db = require('../database/userDB');
var passwordHash  = require('password-hash');

module.exports = function() {
    console.log("Local strategy used");
    passport.use(new LocalStrategy( {
        usernameField: 'email',
        passwordField: 'password'
    },
        function(username, password, done) {
            console.log("username: ", username, ' pwd: ', password);
            db.getUserByEmail(username)
            .then((user) => {
                if(typeof user === 'error') {return done(user)}
                if(user == {}) {return done(null, false, {message: 'Incorrect username'})};
                if(!passwordHash.verify(password, user.pw_hash_salt)) {return done(null, false, {message: 'Incorrect password'})};
                console.log("Auth pass")
                return done(null, user);
            })                
                 
        }
    ))

    passport.serializeUser((user, done ) => {
        console.log("Desiarlize", user.email);
        done(null, user.email);
    })

    passport.deserializeUser((email, done) => {
        console.log("Desiarlize");
        db.getUserByEmail(email)
        .then((user) => {
            if(user == {}) {done(null, false)}
            else {done(null, user)}
        })
        .catch(err => {
            done(err);
        }) 
    });
}
