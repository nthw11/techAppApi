import express from 'express'
import User from '../models/User.js'

import { verifyToken, tokenUser } from '../authentication/verifyToken.js'
import escapeRegex from '../util/searchRegex.js'
import Review from '../models/Review.js'
import cloudinary from '../util/cloudinary.js'

const router = express.Router()

router

  // GET search all users with query strings
  .get('/search', verifyToken, async (req, res, next) => {
    let searchName = ''
    let searchEmail = ''
    let searchPhone = ''

    if (req.query.searchName) {
      searchName = new RegExp(escapeRegex(req.query.searchName), 'gi')
    }
    if (req.query.searchPhone) {
      searchPhone = new RegExp(escapeRegex(req.query.searchPhone), 'gi')
    }
    if (req.query.searchEmail) {
      searchEmail = new RegExp(escapeRegex(req.query.searchEmail), 'gi')
    }

    const filteredUsers = await User.aggregate([
      {
        $project: {
          fullName: {
            $concat: ['$userInfo.userFirstName', ' ', '$userInfo.userLastName'],
          },
          userPhone: '$userInfo.userPhone',
          userEmail: '$userEmail',
          userAvatar: '$userInfo.userAvatar',
          userRating: '$userRating',
        },
      },
      {
        $match: {
          $or: [
            { fullName: searchName },
            { userEmail: searchEmail },
            { userPhone: searchPhone },
          ],
        },
      },
    ])

    if (filteredUsers.length != 0) {
      res.send(filteredUsers)
    } else {
      res.send('No Users matching that search were found')
    }
  })

  // GET all users
  .get('/', verifyToken, async (req, res, next) => {
    User.find().exec((err, users) => {
      if (err) {
        res.status(400).send(err)
        return next(err)
      } else {
        res.status(200).send(users).end()
      }
    })
  })

  // GET user by _id
  .get('/:userId', verifyToken, async (req, res, next) => {
    const userId = req.params.userId
    User.findById(userId)
      .populate('userReviews')
      .exec((err, user) => {
        if (err) {
          res.status(400).send(err)
          return next(err)
        } else {
          res.status(200).send(user).end()
        }
      })
  })

  // PUT edit user info (firstname, lastname, email, phone, address, bio, avatar)
  .put('/:userId', verifyToken, async (req, res, next) => {
    const userId = req.params.userId
    const {
      userFirstName,
      userLastName,
      userEmail,
      userPhone,
      userStreetAddress,
      userCity,
      userState,
      userZipCode,
      userBio,
    } = req.body

    const updatedUser = User.findById(
      { _id: userId },
      async function (err, response) {
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
            const dupEmailCheck = await User.findOne({ userEmail: userEmail })
            if (dupEmailCheck) {
              return res.status(400).send('email already exists in database')
            } else {
              response.userEmail = userEmail
            }
          }
          if (userStreetAddress != '') {
            response.userInfo.userAddress.streetAddress = userStreetAddress
          }
          if (userCity != '') {
            response.userInfo.userAddress.city = userCity
          }
          if (userState != '') {
            response.userInfo.userAddress.state = userState
          }
          if (userZipCode != '') {
            response.userInfo.userAddress.zip = userZipCode
          }
          if (userBio != '') {
            response.userInfo.userBio = userBio
          }
          if (userAvatar != '') {
            response.userInfo.userAvatar = userAvatar
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
  // POST add/update user avatar
  .post('/:userId/avatar', verifyToken, async (req, res, next) => {
    const userId = req.params
    const { userAvatar } = req.body
    const uploadResponse = await cloudinary.uploader.upload(userAvatar, {
      upload_preset: 'techAppAvatars',
    })
    const { url } = uploadResponse
    const updatedUser = User.findById(
      { _id: userId },
      function (err, response) {
        console.log(updatedUser)
        // response.userInfo.userAvatar = url
        // response.save((err, user) => {
        //   if (err) {
        //     return next(err)
        //   } else {
        //     res.status(200).send(user)
        //   }
        // })
      }
    )
  })

  // POST add user rating
  .post('/rating', verifyToken, async (req, res, next) => {
    const {
      reviewerUserId,
      reviewerTechId,
      reviewerName,
      rating,
      review,
      reviewedUser,
    } = req.body
    const newReview = new Review({
      review: review,
      reviewer: {
        reviewerName: reviewerName,
        reviewerTechId: reviewerTechId,
        reviewerUserId: reviewerUserId,
      },
      reviewedUser: reviewedUser,
      rating: rating,
    }).save((err, review) => {
      if (err) {
        return next(err)
      } else {
        User.updateOne(
          { _id: reviewedUser },
          { $push: { userReviews: [review._id] } },

          function (err, user) {
            if (err) {
              res.status(400).send(err)
            } else {
              res.status(201).send(user)
            }
          }
        )
      }
    })

    User.findById({ _id: reviewedUser }, function (err, updatedUser) {})
  })

  // POST update user photos
  .post('/image', verifyToken, async (req, res, next) => {
    const { image, imageCaption, userId } = req.body
    const uploadResponse = await cloudinary.uploader.upload(image, {
      upload_preset: 'techAppUploads',
    })
    const { url, created_at } = uploadResponse
    User.updateOne(
      { _id: userId },
      {
        $push: {
          userPhotos: [
            {
              imageCaption: imageCaption,
              imageUrl: url,
              imageUpDate: created_at,
            },
          ],
        },
      },
      function (err, user) {
        if (err) {
          res.status(400).send(err)
        } else {
          res.status(201).send(user)
        }
      }
    )
  })
  // PUT update user endorsements

  // PUT update user skills, tech notes, favorites

  // PUT update user projects

  // PUT update user companies

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
