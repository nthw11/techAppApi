import express from 'express'
import { verifyToken } from '../authentication/verifyToken.js'
import Project from '../models/Project.js'
import User from '../models/User.js'

const router = express.Router()

router
  // POST Register new project
  .post('/new', verifyToken, async (req, res, next) => {
    const {
      projectName,
      projectDetails,
      projectOwnerId,
      projectOwnerName,
      projectDates,
      streetAddress,
      city,
      state,
      zip,
      locationName,
      rooms,
      projectStatus,
      projectBudget,
      projectDressCode,
    } = req.body

    const newProject = new Project({
      projectName,
      projectDetails,
      projectDates,
      projectLocation: {
        streetAddress,
        city,
        state,
        zip,
        locationName,
        rooms,
      },
      projectStatus,
      projectBudget,
      projectDressCode,
      projectOwner: {
        ownerId: projectOwnerId,
        ownerName: projectOwnerName,
      },
    })
    newProject.save((error, project) => {
      if (error) {
        res.status(400).send(error)
      } else {
        User.findOneAndUpdate(
          { _id: projectOwnerId },
          { $push: { projects: project._id } },
          { new: true },
          (error, user) => {
            if (error) {
              console.log(error)
            } else {
              console.log(user.projects)
            }
          }
        )
      }
      res.send(project).status(200)
    })
  })

  // GET all projects
  .get('/', verifyToken, async (req, res, next) => {
    await Project.find({}, (error, projects) => {
      if (error) {
      } else {
        res.send(projects).status(200)
      }
    })
  })

  // GET project by id
  .get('/:id', verifyToken, async (req, res, next) => {
    const { userId } = req.body
    // TODO - restrict some data based on user type/ user id, etc.
    const { id } = req.params
    await Project.findById(id, (error, project) => {
      if (error) {
        console.log(error)
      } else {
        res.send(project).status(200)
      }
    })
  })

  // delete project
  .delete('/delete/:id', verifyToken, async (req, res, next) => {
    const { id } = req.params
    const { userId } = req.body
    await Project.findByIdAndDelete(id, (error, project) => {
      if (error) {
        console.log(error)
      } else {
        User.findOneAndUpdate(
          { _id: userId },
          { $pull: { projects: project._id } },
          { new: true },
          (error, user) => {
            if (error) {
              console.log(error)
            } else {
              console.log(user.projects)
            }
          }
        )
      }
      res.send(project).status(200)
    })
  })

export default router
