import mongoose from "mongoose";
import bcrypt from 'bcrypt';

const userCollection = "users";

const userSchema = new mongoose.Schema({
  first_name: { type: String, required: true },
  last_name:  { type: String, required: true },
  email:      { type: String, unique: true, required: true },
  age:        { type: Number, required: true },
  password:   { type: String, required: true },
  cart:       { type: mongoose.Schema.Types.ObjectId, ref: 'Cart' },
  role:       { type: String, default: 'user', enum: ['user', 'admin'] }
});

// Hook para encriptar la contraseña antes de guardar
userSchema.pre('save', function(next) {
  if (!this.isModified('password')) return next();
  const salt = bcrypt.genSaltSync(10);
  this.password = bcrypt.hashSync(this.password, salt);
  next();
});

export default mongoose.model(userCollection, userSchema);
