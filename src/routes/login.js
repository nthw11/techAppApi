import express from 'express'
import User from '../models/User.js'
import { loginValidation, newUserValidation } from '../util/loginValidation.js'
import {
  genPassword,
  validatePassword,
  issueJWT,
} from '../authentication/auth.js'

const router = express.Router()

router
  //POST Login existing user
  .post('/', async (req, res, next) => {
    const { error } = loginValidation(req.body)
    if (error) return res.status(400).send(error.details[0].message)
    const { username, password } = req.body

    await User.findOne({ username }).then(async (user) => {
      if (!user) {
        res.status(401).send('could not find user')
      } else {
        const passCheck = await validatePassword(password, user.password)
        if (!passCheck) {
          res.status(401).send('password is incorrect')
        } else {
          const userMinusPassword = {
            _id: user._id,
            // tailor to model
            username: user.username,
            firstname: user.firstname,
            lastname: user.lastname,
            phone: user.phone,
            email: user.email,
          }
          const token = issueJWT(user)
          res.json({ user: userMinusPassword, token: token }).status(200)
        }
      }
    })
  })

  //POST Register new user
  .post('/register', async (req, res, next) => {
    const { username, firstname, lastname, email, phone, password } = req.body
    const { error } = newUserValidation(req.body)
    if (error) return res.status(400).send(error.details[0].message)

    const uniqueEmail = await User.findOne({ email: email })

    if (uniqueEmail)
      return res.status(400).send('email already exists in database')

    const hashedPassword = await genPassword(password)

    const newUser = new User({
      username,
      firstname,
      lastname,
      email,
      phone,
      password: hashedPassword,
    })
    newUser.save((error, user) => {
      if (error) {
        res.status(400).send(error)
      } else {
        const userMinusPassword = {
          _id: user._id,
          username: user.username,
          firstname: user.firstname,
          lastname: user.lastname,
          phone: user.phone,
          email: user.email,
        }
        const token = issueJWT(user)

        res.json({ user: userMinusPassword, token: token }).status(200)
      }
    })
  })

export default router
