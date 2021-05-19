var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var db = require('../database/userDB');
var bcrypt = require('bcrypt');

module.exports = function() {
    // console.log("Local strategy used");
    passport.use(new LocalStrategy( {
        usernameField: 'email',
        passwordField: 'password'
    },
        function(username, password, done) {
            //console.log("username: ", username, ' pwd: ', password);
            return db.getUserByEmail(username)
            .then((user) => {
                if(typeof user === 'error') {
                    return done(user)
                }
                if(Object.keys(user).length === 0) {
                    return done(null, false, {message: 'Incorrect username'})
                }
                if(!bcrypt.compareSync(password, user.pw_hash_salt)) {
                    return done(null, false, {message: 'Incorrect password'});                            
                }                    
                return done(null, user);
                
            })                
                 
        }
    ))

    passport.serializeUser((user, done ) => {
        done(null, user.email);
    })

    passport.deserializeUser((email, done) => {
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
