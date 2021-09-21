const bcrypt = require('bcryptjs')
const gravatar = require('gravatar')
const { Conflict } = require('http-errors')
const { v4 } = require('uuid')

const { sendMail } = require('../../utils')
const { User } = require('../../models')

const signup = async (req, res) => {
  const { email, password } = req.body
  const user = await User.findOne({ email })
  if (user) {
    throw new Conflict('Email in use')
  }
  const defaultAvatar = gravatar.url(email)
  const hashPassword = bcrypt.hashSync(password, bcrypt.genSaltSync(10))
  const result = await User.create({
    email,
    password: hashPassword,
    avatarURL: defaultAvatar,
    verifyToken: v4()
  })

  const data = {
    to: email,
    subject: 'Подтверждение регистрации пользователя на сайте',
    html: `<a href="http://localhost:3000/api/users/verify/${result.verifyToken}">Подтвердите регистрацию</a>`
  }

  await sendMail(data)

  res.status(201).json({
    status: 'Created',
    code: 201,
    user: {
      email: result.email,
      subscription: 'starter',
      avatarURL: result.avatarURL,
      html: data.html
    }
  })
}

module.exports = signup
