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
/**
 * @swagger
 * /:
 *   post:
 *     summary: log in an existing user
 *     description: Log in existing user
 *      responses:
 *        200:
 *          description: success
 *          content:
 *            application/json:
 *              schema:
 *                type: object
 *                properties:
 *                  data:
 *                    type: object
 *                    items:
 *                      type: object
 *
 *
 *
 */
router
  .post('/', async (req, res, next) => {
    const { error } = loginValidation(req.body)
    if (error) return res.status(400).send(error.details[0].message)
    const { username, password } = req.body

    await User.findOne({ userUsername: username }).then(async (user) => {
      if (!user) {
        res.status(401).send('could not find user')
      } else {
        const passCheck = await validatePassword(password, user.password)
        if (!passCheck) {
          res.status(401).send('password is incorrect')
        } else {
          const userMinusPassword = {
            _id: user._id,
            userUsername: user.userUsername,
            userFirstName: user.userInfo.userFirstName,
            userLastName: user.userInfo.userLastName,
            userPhone: user.userInfo.userPhone,
            userEmail: user.userEmail,
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

    const dupEmailCheck = await User.findOne({ userEmail: email })
    if (dupEmailCheck)
      return res.status(400).send('email already exists in database')

    const hashedPassword = await genPassword(password)

    const newUser = new User({
      userUsername: username,
      userEmail: email,
      userInfo: {
        userFirstName: firstname,
        userLastName: lastname,
        userPhone: phone,
      },
      password: hashedPassword,
    })
    newUser.save((error, user) => {
      if (error) {
        res.status(400).send(error)
      } else {
        const userMinusPassword = {
          _id: user._id,
          techUsername: user.userUsername,
          userEmail: user.userEmail,
          userFirstName: user.userInfo.userFirstName,
          userLastName: user.userInfo.userLastName,
          userPhone: user.userInfo.userPhone,
        }
        const token = issueJWT(user)

        res.json({ user: userMinusPassword, token: token }).status(200)
      }
    })
  })

export default router
