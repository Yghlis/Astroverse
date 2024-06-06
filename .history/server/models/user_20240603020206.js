const mongoose = require('mongoose');
const { Schema } = mongoose;
const uuid = require('uuid');

const addressSchema = new Schema({
  street: String,
  city: String,
  state: String,
  postal_code: String,
  country: String
});

const userSchema = new Schema({
  user_id: { type: String, default: uuid.v4, unique: true },
  first_name: { type: String, required: true },
  last_name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password_hash: { type: String, required: true },
  roles: { type: [String], default: ['ROLE_USER'] },
  created_at: { type: Date, default: Date.now },
  updated_at: { type: Date, default: Date.now },
  phone_number: String,
  address: addressSchema
});

const User = mongoose.model('User', userSchema);

export default User;

