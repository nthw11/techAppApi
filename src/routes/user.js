import express from 'express'
import User from '../models/User.js'

import { verifyToken, tokenUser } from '../authentication/verifyToken.js'

const router = express.Router()

router

  // PUT edit user info
  .put('/:userId', verifyToken, async (req, res, next) => {
    const userId = req.params.userId
    const { userFirstName, userLastName, userEmail, userPhone } = req.body

    const updatedUser = User.findById(
      { _id: userId },
      function (err, response) {
        if (err) {
          res.status(400).send(err)
        } else {
          if (userFirstName != '') {
            response.userInfo.userFirstName = userFirstName
          }
          if (userLastName != '') {
            response.userInfo.userLastName = userLastName
          }
          if (userPhone != '') {
            response.userInfo.userPhone = userPhone
          }
          if (userEmail != '') {
            response.userInfo.userEmail = userEmail
          }
          response.save((err, user) => {
            if (err) {
              return next(err)
            } else {
              res.status(200).send(user)
            }
          })
        }
      }
    )
  })

export default router
