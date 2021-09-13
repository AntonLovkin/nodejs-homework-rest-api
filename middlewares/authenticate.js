const jwt = require('jsonwebtoken')
const { Unauthorized } = require('http-errors')

const { User } = require('../models')

const { SECRET_KEY } = process.env

const authenticate = async (req, res, next) => {
  try {
    const [bearer, token] = req.headers.authorization.split(' ')
    if (bearer !== 'Bearer') {
      throw new Unauthorized()
    }
    const { id } = jwt.verify(token, SECRET_KEY)
    console.log(id)
    const user = await User.findOne({ token })

    if (!user) {
      throw new Unauthorized()
    }
    req.user = user
    next()
  } catch (error) {
    throw new Unauthorized('Not authorized')
  }
}

module.exports = authenticate
