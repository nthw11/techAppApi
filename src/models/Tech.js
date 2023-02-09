import mongoose, { Schema as _Schema } from 'mongoose'
const Schema = _Schema

const TechSchema = new Schema({
  techUsername: {
    type: String,
    required: true,
    unique: true,
    minLength: 4,
    maxLength: 24,
  },
  techEmail: { type: String, required: true, unique: true },
  techInfo: {
    techFirstName: { type: String, required: true },
    techLastName: { type: String, required: true },
    techPhone: { type: String },
    techAddress: {
      streetAddress: { type: String },
      city: { type: String },
      state: { type: String },
      zip: { type: String },
    },
    techBio: { type: String },
    techAvatar: { type: String },
  },
  password: { type: String, required: true, minLength: 6 },
  techAvailability: [{ type: String }],
  techSchedule: [{ type: String }],
  techSkills: [{ type: String }],
  techProjects: [{ type: Schema.Types.ObjectId, ref: 'Project' }],
  techRating: { type: String },
  techReviews: [{ type: Schema.Types.ObjectId, ref: 'Review' }],
  techEndorsements: [{ type: Schema.Types.ObjectId, ref: 'Review' }],
  techPhotos: [{ type: String }],
  techUserNotes: [{ type: String }],
  techFavorites: [{ type: Schema.Types.ObjectId, ref: 'Tech' }],
})

export default mongoose.model('Tech', TechSchema)
