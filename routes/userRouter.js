const express = require('express')
const auth = require('../middleware/auth')
const { userRegistration,userLogin,userInfo } = require('../controller/userController')

const router = express.Router()

router.post('/users/register',userRegistration)

router.post('/users/login',userLogin)

router.get('/users/info',auth,userInfo)

module.exports = router