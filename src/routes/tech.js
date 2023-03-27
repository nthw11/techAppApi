import express from 'express'
import Tech from '../models/Tech.js'

import { verifyToken, tokenUser } from '../authentication/verifyToken.js'

const router = express.Router()

router

  // PUT edit tech info
  .put('/:techId', verifyToken, async (req, res, next) => {
    const techId = req.params.techId
    const {
      techFirstName,
      techLastName,
      techPhone,
      techEmail,
      techStreetAddress,
      techCity,
      techState,
      techZipCode,
      techBio,
    } = req.body

    const updatedTech = Tech.findById(
      { _id: techId },
      async function (err, response) {
        if (err) {
          res.status(400).send(err)
        } else {
          if (techFirstName != '') {
            response.techInfo.techFirstName = techFirstName
          }
          if (techLastName != '') {
            response.techInfo.techLastName = techLastName
          }
          if (techPhone != '') {
            response.techInfo.techPhone = techPhone
          }
          if (techEmail != '') {
            if (techEmail === response.techEmail) {
              response.techEmail = techEmail
            } else {
              const dupEmailCheck = await Tech.findOne({ techEmail: techEmail })
              if (dupEmailCheck) {
                return res.status(400).send('email already exists in database')
              } else {
                response.techEmail = techEmail
              }
            }
          }
          if (techStreetAddress != '') {
            response.techInfo.techAddress.streetAddress = techStreetAddress
          }
          if (techCity != '') {
            response.techInfo.techAddress.city = techCity
          }
          if (techState != '') {
            response.techInfo.techAddress.state = techState
          }
          if (techZipCode != '') {
            response.techInfo.techAddress.zip = techZipCode
          }
          if (techBio != '') {
            response.techInfo.techBio = techBio
          }
          response.save((err, tech) => {
            if (err) {
              return next(err)
            } else {
              const techMinusPassword = {
                _id: tech._id,
                techUsername: tech.techUsername,
                techEmail: tech.techEmail,
                techFirstName: tech.techInfo.techFirstName,
                techLastName: tech.techInfo.techLastName,
                techPhone: tech.techInfo.techPhone,
                techStreetAddress: tech.techInfo.techAddress.streetAddress,
                techCity: tech.techInfo.techAddress.city,
                techState: tech.techInfo.techAddress.state,
                techZipCode: tech.techInfo.techAddress.zip,
                techBio: tech.techInfo.techBio,
              }
              res.status(200).send(techMinusPassword)
            }
          })
        }
      }
    )
  })

export default router
