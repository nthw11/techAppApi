import express from 'express'
import Tech from '../models/Tech.js'
import { loginValidation, newUserValidation } from '../util/loginValidation.js'
import {
  genPassword,
  validatePassword,
  issueJWT,
} from '../authentication/auth.js'

const router = express.Router()

router
  //POST Login existing tech
  .post('/', async (req, res, next) => {
    const { error } = loginValidation(req.body)
    if (error) return res.status(400).send(error.details[0].message)
    const { username, password } = req.body

    await Tech.findOne({ techUsername: username }).then(async (tech) => {
      if (!tech) {
        res.status(401).send('could not find tech')
      } else {
        const passCheck = await validatePassword(password, tech.password)
        if (!passCheck) {
          res.status(401).send('password is incorrect')
        } else {
          const techMinusPassword = {
            _id: tech._id,
            techUsername: tech.techUsername,
            techFirstName: tech.techInfo.techFirstName,
            techLastName: tech.techInfo.techLastName,
            techPhone: tech.techInfo.techPhone,
            techEmail: tech.techEmail,
          }
          const token = issueJWT(tech)
          res.json({ tech: techMinusPassword, token: token }).status(200)
        }
      }
    })
  })

  //POST Register new tech
  .post('/register', async (req, res, next) => {
    const { username, firstname, lastname, email, phone, password } = req.body
    const { error } = newUserValidation(req.body)
    if (error) return res.status(400).send(error.details[0].message)

    const uniqueEmail = await Tech.findOne({ email: email })

    if (uniqueEmail)
      return res.status(400).send('email already exists in database')

    const hashedPassword = await genPassword(password)

    const newTech = new Tech({
      techUsername: username,
      techEmail: email,
      techInfo: {
        techFirstName: firstname,
        techLastName: lastname,
        techPhone: phone,
      },
      password: hashedPassword,
    })
    newTech.save((error, tech) => {
      if (error) {
        res.status(400).send(error)
      } else {
        const techMinusPassword = {
          _id: tech._id,
          techUsername: tech.techUsername,
          techFirstName: tech.techInfo.techFirstName,
          techLastName: tech.techInfo.techLastName,
          techPhone: tech.techInfo.techPhone,
          techEmail: tech.techEmail,
        }
        const token = issueJWT(tech)

        res.json({ tech: techMinusPassword, token: token }).status(200)
      }
    })
  })

export default router
