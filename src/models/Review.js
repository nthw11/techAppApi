import mongoose, { Schema as _Schema } from 'mongoose'
const Schema = _Schema

const ReviewSchema = new Schema({
  reviewer: {
    reviewerName: { type: String },
    reviewerUserId: { type: Schema.Types.ObjectId, ref: 'User' },
    reviewerTechId: { type: Schema.Types.ObjectId, ref: 'Tech' },
  },
  reviewedTech: { type: Schema.Types.ObjectId, ref: 'Tech' },
  reviewedUser: { type: Schema.Types.ObjectId, ref: 'Tech' },
  rating: { type: String },
  review: { type: String },
})

export default mongoose.model('Review', ReviewSchema)
