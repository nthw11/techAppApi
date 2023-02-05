import mongoose, { Schema as _Schema, model, mongo } from 'mongoose'
const Schema = _Schema

const UserSchema = new Schema({
  username: {
    type: String,
    required: true,
    unique: true,
    minLength: 4,
    maxLength: 24,
  },
  firstname: { type: String, required: true },
  lastname: { type: String, required: true },
  phone: { type: String },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true, minLength: 6 },
})

export default mongoose.model('User', UserSchema)
