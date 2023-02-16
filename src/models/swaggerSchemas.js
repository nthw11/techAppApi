import m2s from 'mongoose-to-swagger'
import User from './User.js'
import Tech from './Tech.js'
import Review from './Review.js'
import Project from './Project.js'
import Company from './Company.js'

const userSchema = m2s(User)
const techSchema = m2s(Tech)
const reviewSchema = m2s(Review)
const projectSchema = m2s(Project)
const companySchema = m2s(Company)
export { userSchema, techSchema, reviewSchema, projectSchema, companySchema }
