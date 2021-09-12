const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const { BadRequest } = require('http-errors')
const { User } = require('../../models')

const login = async (req, res, next) => {
  try {
    const { email, password } = req.body
    const user = await User.findOne({ email })

    if (!user) {
      throw new BadRequest('Email or password is wrong')
    }

    const hashPassword = user.password
    const compareResult = bcrypt.compareSync(password, hashPassword)
    // const compareResult = user.comparePassword(password)
    if (!compareResult) {
      throw new BadRequest('Email or password is wrong')
    }

    const payload = {
      id: user._id
    }

    const { SECRET_KEY } = process.env

    const token = jwt.sign(payload, SECRET_KEY)
    await User.findByIdAndUpdate(user._id, { token })

    res.json({
      token,
      user: {
        email,
        subscription: user.subscription
      }
    })
  } catch (error) {
    next(error)
  }
}

module.exports = login
