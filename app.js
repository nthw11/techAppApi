import express from 'express'
import {} from 'dotenv/config'
import connectDB from './src/config/db.js'

import testRoutes from './src/routes/test.js'
import userRoutes from './src/routes/user.js'
import loginRoutes from './src/routes/login.js'

const app = express()
const PORT = process.env.PORT || 8000

// Database connection
connectDB()

app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*')
  res.header('Access-Control-Allow-Methods', 'GET, PUT, POST, DELETE')
  res.header(
    'Access-Control-Allow-Headers',
    'Origin, X-Requested-With, Content-Type, Accept, Authorization, token'
  )
  if ('OPTIONS' == req.method) {
    return res.sendStatus(200)
  } else {
    next()
  }
})

app.use(express.json())
app.use(
  express.urlencoded({
    extended: true,
  })
)

app.use('/api/test', testRoutes)
app.use('/api/user', userRoutes)
app.use('/api/login', loginRoutes)

export default app.listen(PORT, () => {
  console.log(`app is listening on port ${PORT}`)
})
