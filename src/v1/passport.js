const passport = require('passport');
const JwtStrategy = require('passport-jwt').Strategy;
const ExtractJwt = require('passport-jwt').ExtractJwt;

const { userS } = require('./service');

const jwtCfg = () => {
	passport.use(
		new JwtStrategy(
			{
				jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
				secretOrKey: process.env.ACCESS_TOKEN_SECRET,
				passReqToCallback: true,
			},
			async (req, payload, done) => {
				try {
					const { sub: username } = payload;
					await userS.findByUsername(username);
					done(null, payload);
				} catch (error) {
					console.log(`Error: ${error.message}`);
					return done(error, null);
				}
			},
		),
	);
};

module.exports = { jwtCfg };
