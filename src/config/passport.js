import passport from 'passport';
import LocalStrategy from 'passport-local';
import { Strategy as JwtStrategy, ExtractJwt } from 'passport-jwt';
import userModel from '../models/userModel.js';
import bcrypt from 'bcrypt';
import dotenv from 'dotenv';
dotenv.config();

// Estrategia Local para Login
passport.use('login', new LocalStrategy({
  usernameField: 'email',
  passwordField: 'password'
}, async (email, password, done) => {
  try {
    const user = await userModel.findOne({ email });
    if (!user) return done(null, false, { message: 'Usuario no encontrado' });
    if (!bcrypt.compareSync(password, user.password)) {
      return done(null, false, { message: 'Contraseña incorrecta' });
    }
    return done(null, user);
  } catch (error) {
    return done(error);
  }
}));

// Opciones y estrategia JWT
const opts = {
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  secretOrKey: process.env.JWT_SECRET
};

passport.use('jwt', new JwtStrategy(opts, async (jwt_payload, done) => {
  try {
    const user = await userModel.findById(jwt_payload.id);
    if (user) return done(null, user);
    return done(null, false);
  } catch (error) {
    return done(error, false);
  }
}));

export default passport;
