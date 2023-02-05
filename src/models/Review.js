import mongoose, { Schema as _Schema } from 'mongoose'
const Schema = _Schema

const ReviewSchema = new Schema({
  // reviewerName: {}
})

export default mongoose.model('Review', ReviewSchema)
