import express from 'express'

const router = express.Router()

router.get('/', (req, res, next) => {
  console.log('test route')
  res.send('test route is working')
})

export default router
