const bcrypt = require('bcryptjs')
const gravatar = require('gravatar')
const { Conflict } = require('http-errors')
const { User } = require('../../models')

const signup = async (req, res, next) => {
  try {
    const { email, password } = req.body
    const user = await User.findOne({ email })
    if (user) {
      throw new Conflict('Email in use')
    }
    const defaultAvatar = gravatar.url(email)
    const hashPassword = bcrypt.hashSync(password, bcrypt.genSaltSync(10))
    const result = await User.create({ email, password: hashPassword, avatarURL: defaultAvatar })

    res.status(201).json({
      status: 'Created',
      code: 201,
      user: {
        email: result.email,
        subscription: 'starter',
        avatarURL: result.avatarURL
      }
    })
  } catch (error) {
    next(error)
  }
}

module.exports = signup
