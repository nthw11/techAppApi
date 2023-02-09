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
          console.log(response)
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
            response.userEmail = userEmail
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

  //DELETE user
  .delete('/delete/:userId', verifyToken, async (req, res, next) => {
    const userId = req.params.userId
    User.findByIdAndDelete(userId).exec((err) => {
      if (err) {
        res.status(400).send(err)
        return next(err)
      } else {
        res
          .send('User has been successfully removed from the system')
          .status(204)
          .end()
      }
    })
  })

export default router
