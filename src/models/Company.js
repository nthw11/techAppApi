import mongoose, { Schema as _Schema } from 'mongoose'
const Schema = _Schema

const CompanySchema = new Schema({
  companyName: { type: String, required: true, unique: true, minLength: 2 },
  companyOwner: { type: Schema.Types.ObjectId, ref: 'User' },
  companyInfo: {
    streetAddress: { type: String },
    city: { type: String },
    state: { type: String },
    zip: { type: String },
    phone: { type: String },
  },
  companyAbout: { type: String },
  companyUsers: [{ type: Schema.Types.ObjectId, ref: 'User' }],
  companyProjects: [{ type: Schema.Types.ObjectId, ref: 'Project' }],
  companyPhotos: [{ type: String }],
})

export default mongoose.model('Company', CompanySchema)
