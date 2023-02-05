import jsonwebtoken from 'jsonwebtoken'

const verifyToken = (req, res, next) => {
  const token = req.header('token')
  if (!token) return res.status(401).send('Access Denied')
  try {
    const verified = jsonwebtoken.verify(token, process.env.AUTH_SECRET)
    const tokenElements = jsonwebtoken.decode(token, process.env.AUTH_SECRET)
    req.user = verified
    next()
  } catch (err) {
    res.status(400).send('Invalid Token')
  }
}

const tokenUser = (req) => {
  const token = req.header('token')

  const userIdFromToken = jsonwebtoken.decode(token, process.env.AUTH_SECRET)
  return userIdFromToken
}

export { verifyToken, tokenUser }
