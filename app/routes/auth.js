const express = require('express')
const router = express.Router()
require('../../config/passport')
const passport = require('passport')
const requireAuth = passport.authenticate('jwt', {
  session: false
})
const trimRequest = require('trim-request')

const {
  login,
  register,
  verify,
  getRefreshToken,
  roleAuthorization,
  nonce,
  loginNft
} = require('../controllers/auth')

const {
  validateRegister,
  validateLogin,
  validateVerify,
  validateLoginNft
} = require('../controllers/auth/validators')

const { discordInvite } = require('../controllers/auth/helpers/discordInvite')
const { createLocalAdmin } = require('../middleware/auth/createLocalAdmin')
const { getAdmin } = require('../middleware/auth/getAdmin')
const { validateHolder } = require('../middleware/external/contractCalls')

/*
 * Auth routes
 */

/*
 * Register route
 */
router.post('/register', trimRequest.all, validateRegister, register)

/*
 * Forgot password route
 */
// router.post('/forgot', trimRequest.all, validateForgotPassword, forgotPassword)

/*
 * Reset password route
 */
// router.post('/reset', trimRequest.all, validateResetPassword, resetPassword)

/*
 * Login route
 */
router.post('/login', trimRequest.all, validateLogin, login)

/*
 * Get new refresh token
 */

router.get(
  '/token',
  requireAuth,
  roleAuthorization(['user', 'admin']),
  trimRequest.all,
  getRefreshToken
)
/*
 * Verify route
 */
router.post('/verify', trimRequest.all, validateVerify, verify)

router.post('/loginnft', trimRequest.all, validateLoginNft, loginNft)

router.get('/validateholder', trimRequest.all, validateHolder)

router.post('/create-local-admin', trimRequest.all, createLocalAdmin)

router.get(
  '/getAdminId',
  requireAuth,
  roleAuthorization(['user', 'admin']),
  trimRequest.all,
  getAdmin
)

router.get('/nonce', trimRequest.all, nonce)

router.get(
  '/discord-invite',
  requireAuth,
  roleAuthorization(['user']),
  trimRequest.all,
  discordInvite
)

module.exports = router
