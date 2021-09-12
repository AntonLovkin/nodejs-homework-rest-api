const express = require('express')
const { joiSchema } = require('../../models/user')
const { validation, authenticate, controllerWrapper } = require('../../middlewares')

const { users: ctrl } = require('../../controllers')

const router = express.Router()

const userValidationMiddleware = validation(joiSchema)

router.post('/signup', userValidationMiddleware, controllerWrapper(ctrl.signup))

router.post('/login', userValidationMiddleware, controllerWrapper(ctrl.login))

router.get('/logout', controllerWrapper(authenticate), ctrl.logout)

router.get('/current', controllerWrapper(authenticate), controllerWrapper(ctrl.current))

module.exports = router
