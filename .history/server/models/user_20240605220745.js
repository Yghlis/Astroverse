import mongoose from 'mongoose';
import { v4 as uuidv4 } from 'uuid';

const { Schema } = mongoose;

const addressSchema = new Schema({
  street: String,
  city: String,
  state: String,
  postal_code: String,
  country: String
});

//penser a changer le schéma suite a la discussion avec ash 
const userSchema = new Schema({
  user_id: { type: String, default: uuidv4, unique: true },
  first_name: { type: String, required: true },
  last_name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password_hash: { type: String, required: true },
  isEmailVerified: { type: Boolean, default: false },
  emailVerificationToken: { type: String, default: () => uuidv4() },
  emailVerificationExpires: { type: Date },
  roles: { type: [String], default: ['ROLE_USER'] },
  created_at: { type: Date, default: Date.now },
  updated_at: { type: Date, default: Date.now },
  phone_number: String,
  address: addressSchema
});

const User = mongoose.model('User', userSchema);

export default User;
