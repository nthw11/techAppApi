import mongoose from 'mongoose'

import * as dotenv from 'dotenv'

dotenv.config()

const dbConnection = process.env.MONGO_DB_CONNECTION

export default function connectDB() {
  try {
    mongoose.connect(dbConnection, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    })
    console.log(`DATABASE CONNECTED`)
  } catch (error) {
    console.log(error.message)
    process.exit(1)
  }
}
