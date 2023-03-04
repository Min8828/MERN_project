const passport = require("passport");

const JwtStrategy = require("passport-jwt").Strategy;
const ExtractJwt = require("passport-jwt").ExtractJwt;
const User = require("../models").user;

module.exports = (passport) => {
  let opts = {};
  opts.jwtFromRequest = ExtractJwt.fromAuthHeaderWithScheme("jwt");
  opts.secretOrKey = process.env.PASSPORT_SECRET;
  passport.use(
    new JwtStrategy(opts, async (jwt_payload, done) => {
      //   console.log(jwt_payload);
      try {
        let foundUser = await User.findById({ _id: jwt_payload._id }).exec();
        if (foundUser) done(null, foundUser); // req.user = foundUser
        else done(null, false);
      } catch (e) {
        done(e, false);
      }
    })
  );
};
