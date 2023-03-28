import mongoose, { Schema as _Schema } from 'mongoose'

const Schema = _Schema

const UserSchema = new Schema({
  username: {
    type: String,
    required: true,
    unique: true,
    minLength: 4,
    maxLength: 24,
  },
  userType: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  userInfo: {
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    phone: { type: String },
    address: {
      streetAddress: { type: String },
      city: { type: String },
      state: { type: String },
      zip: { type: String },
    },
    bio: { type: String },
    avatar: { type: String },
  },
  password: { type: String, required: true, minLength: 6 },
  companies: [{ type: Schema.Types.ObjectId, ref: 'Company' }],
  projects: [{ type: Schema.Types.ObjectId, ref: 'Project' }],
  rating: { type: String },
  reviews: [{ type: Schema.Types.ObjectId, ref: 'Review' }],
  endorsements: [{ type: Schema.Types.ObjectId, ref: 'Review' }],
  photos: [
    {
      imageUrl: { type: String, required: true },
      imageCaption: { type: String, required: true },
      imageUpDate: { type: String },
      imageTags: [{ type: String }],
    },
  ],
  techNotes: [{ type: String }],
  managerNotes: [{ type: String }],
  favoriteTechs: [{ type: Schema.Types.ObjectId, ref: 'User' }],
  availability: [{ type: String }],
  schedule: [{ type: String }],
  skills: [
    {
      skillName: { type: String },
      skillRateFull: { type: String },
      skillRateHalf: { type: String },
      skillNegotiable: { type: Boolean },
    },
  ],
})

export default mongoose.model('User', UserSchema)
