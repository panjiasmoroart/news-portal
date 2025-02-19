const authController = require('../controllers/authController')
const router = require('express').Router()

router.post('/api/login', authController.login)

module.exports = router