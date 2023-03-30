import express from 'express'
import User from '../models/User.js'

import { verifyToken, tokenUser } from '../authentication/verifyToken.js'

const router = express.Router()

router
  // PUT update user skills, tech notes, favorites
  .put('/:userId', verifyToken, async (req, res, next) => {
    const skills = req.body
    const userId = req.params.userId

    User.findById(
      { _id: userId },

      function (err, user) {
        user.skills = skills
        console.log(user.skills)
        user.save((err, user) => {
          if (err) {
            res.status(400).send(err)
          } else {
            res.status(201).send(user)
          }
        })
      }
    )
  })

export default router
