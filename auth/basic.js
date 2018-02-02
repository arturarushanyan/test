const passport = require('passport');
const BasicStrategy = require('passport-http').BasicStrategy;

const authenticate = (username, password, callback) => {
  if(username === "riota" && password === "Manager$1") {
    return callback(null, {
        username: 'riota',
        displayName: 'RIOTA'
    });
  } else {
    return callback(null,false)
  }
};

passport.use(new BasicStrategy(authenticate));

exports.isAuthenticated = passport.authenticate('basic', {session: false});