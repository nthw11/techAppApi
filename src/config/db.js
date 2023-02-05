import mongoose from 'mongoose'

import * as dotenv from 'dotenv'

dotenv.config()

const dbConnection = process.env.MONGO_DB_CONNECTION
// Cut and Paste into .env file with appropriate user, password and db name
// This can also be found in the connection tab on the MongoDB site
// MONGO_DB_CONNECTION: mongodb+srv://{USER_NAME}:{PASSWORD}@cluster0.q2hkbgs.mongodb.net/{CLUSTER_NAME}?retryWrites=true&w=majority

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
