const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const mongoose = require('mongoose');
const crypto = require('crypto');
const User = mongoose.model('user', {
    username:String,
    password:String,
    name: String,
sector: String,
},'user');


passport.serializeUser(function (user, done) {
  done(null, user._id);
});

passport.deserializeUser(function (id, done) {
  User.findById(id, function (err, user) {
    done(err, user);
  });
});

passport.use('login',
  new LocalStrategy(
    function (username, password, done) {
      mongoose.connect('mongodb://localhost:27017/user2', {
        useNewUrlParser: true
      });
      User.findOne({
        username: username
      }, function (err, user) {
        if (err) return done(err);
        if (!user) {
          return done(null, false);
        }
        const hash = crypto.createHash('sha256').update(password).digest('hex');
        if (user.password !== hash) {
          return done(null, false);
        }
        return done(null, user);
      });
    }));

module.exports = User;