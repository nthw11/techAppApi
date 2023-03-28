import express from 'express'
import User from '../models/User.js'
import { loginValidation, newUserValidation } from '../util/loginValidation.js'
import {
  genPassword,
  validatePassword,
  issueJWT,
} from '../authentication/auth.js'
import { verifyToken } from '../authentication/verifyToken.js'

const router = express.Router()

router
  //POST Login existing user
  .post('/', async (req, res, next) => {
    const { error } = loginValidation(req.body)
    if (error) return res.status(400).send(error.details[0].message)
    const { username, password } = req.body

    await User.findOne({ username: username }).then(async (user) => {
      if (!user) {
        res.status(401).send('could not find user')
      } else {
        const passCheck = await validatePassword(password, user.password)
        if (!passCheck) {
          res.status(401).send('password is incorrect')
        } else {
          const userMinusPassword = {
            _id: user._id,
            username: user.username,
            firstName: user.userInfo.firstName,
            lastName: user.userInfo.lastName,
            phone: user.userInfo.phone,
            email: user.email,
            userType: user.userType,
            streetAddress: user.userInfo.address.streetAddress,
            city: user.userInfo.address.city,
            state: user.userInfo.address.state,
            zipCode: user.userInfo.address.zip,
            avatar: user.userInfo.avatar,
            bio: user.userInfo.bio,
            rating: user.rating,
            reviews: user.reviews,
            companies: user.companies,
            projects: user.projects,
            endorsements: user.endorsements,
            photos: user.photos,
            techNotes: user.techNotes,
            managerNotes: user.managerNotes,
            favoriteTechs: user.favoriteTechs,
            availability: user.availability,
            schedule: user.schedule,
            skills: user.skills,
          }
          const token = issueJWT(user)
          res.json({ user: userMinusPassword, token: token }).status(200)
        }
      }
    })
  })

  //POST Register new user
  .post('/register', async (req, res, next) => {
    const { username, firstName, lastName, email, phone, password, userType } =
      req.body
    const { error } = newUserValidation(req.body)
    if (error) return res.status(400).send(error.details[0].message)

    const dupEmailCheck = await User.findOne({ email: email })
    if (dupEmailCheck)
      return res.status(400).send('email already exists in database')

    const hashedPassword = await genPassword(password)

    const newUser = new User({
      userType: userType,
      username: username,
      email: email,
      userInfo: {
        firstName: firstName,
        lastName: lastName,
        phone: phone,
      },
      password: hashedPassword,
    })
    newUser.save((error, user) => {
      if (error) {
        res.status(400).send(error)
      } else {
        const userMinusPassword = {
          _id: user._id,
          username: user.username,
          email: user.email,
          firstName: user.userInfo.firstName,
          lastName: user.userInfo.lastName,
          phone: user.userInfo.phone,
          userType: user.userType,
        }
        const token = issueJWT(user)

        res.json({ user: userMinusPassword, token: token }).status(200)
      }
    })
  })

export default router
