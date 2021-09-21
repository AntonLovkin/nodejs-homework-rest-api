const { BadRequest } = require('http-errors')
const { User } = require('../../models')
const { sendMail } = require('../../utils')

const verifyReSend = async (req, res) => {
  const { email } = req.body

  if (!email) {
    throw new BadRequest('missing required field email')
  }

  const user = await User.findOne({ email })
  const data = {
    to: email,
    subject: 'Подтверждение регистрации пользователя на сайте',
    html: `<a href="http://localhost:3000/api/users/verify/${user.verifyToken}">Подтвердите регистрацию повторно</a>`
  }

  if (user.verify) {
    throw new BadRequest('Verification has already been passed')
  }
  await sendMail(data)

  res.status(200).json({
    status: 'Ok',
    code: 200,
    message: 'successful',
    html: data.html
  })
}

module.exports = verifyReSend
