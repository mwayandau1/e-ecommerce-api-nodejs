const {createOrder, getAllOrders,
    getSingleOrder, updateOrder,
    getCurrentUserOrders } = require('../controllers/orderController');
const {authenticateUser, authorizePermissions}= require('../middleware/authentication')
const router = require('express').Router();

router.route('/').post(authenticateUser, createOrder)
                 .get(authenticateUser,authorizePermissions("admin"), getAllOrders)
router.route('/show-all-my-orders').get(authenticateUser, getCurrentUserOrders)
router.route('/:id').get(getSingleOrder)
                    .patch(updateOrder)



module.exports = router