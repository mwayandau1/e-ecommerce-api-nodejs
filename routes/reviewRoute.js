const {
    createReview, getAllReviews,
     getSingleReview, updateReview, deleteReview
} = require('../controllers/reviewController')
const router = require('express').Router()
const {authenticateUser} = require('../middleware/authentication');


router.route('/').get(getAllReviews).post(authenticateUser, createReview);
router.route('/:id').get(getSingleReview)
.patch(authenticateUser, updateReview)
.delete(authenticateUser, deleteReview)


module.exports = router