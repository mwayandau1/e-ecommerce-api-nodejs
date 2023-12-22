const {getAllUsers, getSingleUser,
     showCurrentUser, updateUser, updateUserPassword} = require('../controllers/userController')
const router = require('express').Router()
const {authenticateUser, authorizePermissions} = require('../middleware/authentication')




router.get('/',authenticateUser,authorizePermissions('admin'),  getAllUsers)
router.route('/show-me').get(showCurrentUser)
router.patch('/update-user', updateUser)
router.patch('/update-user-password', updateUserPassword)
router.get('/:id',authenticateUser, getSingleUser)

module.exports = router