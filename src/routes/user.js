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
            $concat: ['$userInfo.firstName', ' ', '$userInfo.lastName'],
          },
          phone: '$userInfo.phone',
          email: '$email',
          avatar: '$userInfo.avatar',
          rating: '$rating',
        },
      },
      {
        $match: {
          $or: [
            { fullName: searchName },
            { email: searchEmail },
            { phone: searchPhone },
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
      firstName,
      lastName,
      email,
      phone,
      streetAddress,
      city,
      state,
      zip,
      bio,
    } = req.body

    const updatedUser = User.findById(
      { _id: userId },
      async function (err, response) {
        if (err) {
          res.status(400).send(err)
        } else {
          if (firstName != '') {
            response.userInfo.firstName = firstName
          }
          if (lastName != '') {
            response.userInfo.lastName = lastName
          }
          if (phone != '') {
            response.userInfo.phone = phone
          }
          if (email != '') {
            if (email === response.email) {
              response.email = email
            } else {
              const dupEmailCheck = await User.findOne({ email: email })
              if (dupEmailCheck) {
                return res.status(400).send('email already exists in database')
              } else {
                response.email = email
              }
            }
          }
          if (streetAddress != '') {
            response.userInfo.address.streetAddress = streetAddress
          }
          if (city != '') {
            response.userInfo.address.city = city
          }
          if (state != '') {
            response.userInfo.address.state = state
          }
          if (zip != '') {
            response.userInfo.address.zip = zip
          }
          if (bio != '') {
            response.userInfo.bio = bio
          }

          response.save((err, user) => {
            if (err) {
              return next(err)
            } else {
              const userMinusPassword = {
                _id: user._id,
                userType: user.userType,
                username: user.username,
                firstName: user.userInfo.firstName,
                lastName: user.userInfo.lastName,
                phone: user.userInfo.phone,
                email: user.email,
                streetAddress: user.userInfo.address.streetAddress,
                city: user.userInfo.address.city,
                state: user.userInfo.address.state,
                zip: user.userInfo.address.zip,
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
              res.status(200).send(userMinusPassword)
            }
          })
        }
      }
    )
  })
  // POST add/update user avatar
  .post('/:userId/avatar', verifyToken, async (req, res, next) => {
    const { userId } = req.params
    const { avatar } = req.body
    const uploadResponse = await cloudinary.uploader.upload(avatar, {
      upload_preset: 'techAppAvatars',
    })
    const { url } = uploadResponse
    const updatedUser = User.findById(
      { _id: userId },
      async function (err, response) {
        if (err) {
          res.status(400).send(err)
        } else {
          response.userInfo.avatar = url
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

  // POST add user rating
  .post('/rating', verifyToken, async (req, res, next) => {
    const {
      reviewerManagerId,
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
        reviewerManagerId: reviewerManagerId,
      },
      reviewedUser: reviewedUser,
      rating: rating,
    }).save((err, review) => {
      if (err) {
        return next(err)
      } else {
        User.updateOne(
          { _id: reviewedUser },
          { $push: { reviews: [review._id] } },

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
              imageTags: [],
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
