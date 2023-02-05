import mongoose, { Schema as _Schema } from 'mongoose'
const Schema = _Schema

const UserSchema = new Schema({
  userUsername: {
    type: String,
    required: true,
    unique: true,
    minLength: 4,
    maxLength: 24,
  },
  userInfo: {
    userFirstName: { type: String, required: true },
    userLastName: { type: String, required: true },
    userPhone: { type: String },
    userEmail: { type: String, required: true, unique: true },
    userAddress: {
      streetAddress: { type: String },
      city: { type: String },
      state: { type: String },
      zip: { type: String },
    },
    userBio: { type: String },
    userAvatar: { type: String },
  },
  password: { type: String, required: true, minLength: 6 },
  userCompanies: [{ type: Schema.Types.ObjectId, ref: 'Company' }],
  userProjects: [{ type: Schema.Types.ObjectId, ref: 'Project' }],
  userRating: { type: String },
  userReviews: [{ type: Schema.Types.ObjectId, ref: 'Review' }],
  userEndorsements: [{ type: Schema.Types.ObjectId, ref: 'Review' }],
  userPhotos: [{ type: String }],
  userTechNotes: [{ type: String }],
  userFavorites: [{ type: Schema.Types.ObjectId, ref: 'Tech' }],
})

export default mongoose.model('User', UserSchema)
