import mongoose, { Schema as _Schema } from 'mongoose'
const Schema = _Schema

const ProjectSchema = new Schema({
  projectName: { type: String, required: true, minLength: 2 },
  projectOwner: {
    ownerId: { type: Schema.Types.ObjectId, ref: 'User' },
    ownerName: { type: String },
  },
  projectCompany: {
    companyId: { type: Schema.Types.ObjectId, ref: 'Company' },
    companyName: { type: String },
  },
  projectDates: [{ type: String }],
  projectLocation: {
    streetAddress: { type: String },
    city: { type: String },
    state: { type: String },
    zip: { type: String },
    locationName: { type: String },
    rooms: [{ type: String }],
  },
  projectDetails: [{ type: String }],
  projectTechs: [{ type: Schema.Types.ObjectId, ref: 'User' }],
  projectBudget: { type: String },
  projectLodgingDetails: [{ type: String }],
  projectDressCode: { type: String },
  projectStatus: { type: String },
})

export default mongoose.model('Project', ProjectSchema)
