const express = require('express')
const { joiSchema } = require('../../models/user')
const { validation, authenticate, controllerWrapper, upload } = require('../../middlewares')

const { users: ctrl } = require('../../controllers')

const router = express.Router()

const userValidationMiddleware = validation(joiSchema)

router.post('/signup', userValidationMiddleware, controllerWrapper(ctrl.signup))

router.get('/verify/:verifyToken', controllerWrapper(ctrl.verify))

router.post('/verify', controllerWrapper(ctrl.verifyReSend))

router.post('/login', userValidationMiddleware, controllerWrapper(ctrl.login))

router.get('/logout', controllerWrapper(authenticate), ctrl.logout)

router.get('/current', controllerWrapper(authenticate), controllerWrapper(ctrl.current))

router.patch('/avatars/:id', upload.single('avatar'), controllerWrapper(authenticate), ctrl.updateImg)

module.exports = router
