import express from 'express'

const router = express.Router()

router.get('/', (req, res, next) => {
  const testNumber = Math.floor(Math.random() * 100)
  console.log('test route')
  console.log(testNumber)
  res.send(testNumber.toString())
})

export default router
