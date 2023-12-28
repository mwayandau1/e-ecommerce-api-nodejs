const Review = require("../models/reviewModel")
const Product = require('../models/productModel')
const {StatusCodes} = require('http-status-codes')
const checkPermissions = require('../utils/checkPermissions')
const { NotFoundError, BadRequestError } = require("../errors")

const createReview = async(req, res)=>{
    const {product:productId} = req.body
    const isProductAvailable = await Product.findOne({_id:productId})
    if(!isProductAvailable){
        throw new NotFoundError(`No product with id:${productId} exist`)
    }
    const alreadySubmitted = await Review.findOne({product:productId,
        user:req.user.id})
        if(alreadySubmitted){
            throw new BadRequestError("You have submitted a review already")
        }
    req.body.user = req.user.id
    const product = await Review.create(req.body)
    res.status(StatusCodes.CREATED).json({product})
}

const getAllReviews = async(req, res)=>{
    const reviews = await Review.find({}).populate({
        path:'product',
        select:"name company price"
    })

    res.status(StatusCodes.OK).json({reviews, count:reviews.length})
}
const getSingleReview = async(req, res)=>{
    const {id} = req.params;
    const review = await Review.findOne({_id:id})
    if(!review){
        throw new NotFoundError(`No review matches the id:${id}`)
    }
    res.status(StatusCodes.OK).json({review})
}
const updateReview = async(req, res)=>{
    const {id} = req.params;
    const {rating, title, comment} = req.body;
    const review = await Review.findOne({_id:id})
    if(!review){
        throw new NotFoundError(`No review matches the id:${id}`)
    }
    checkPermissions(req.user, review.user)
    review.rating = rating;
    review.title = title;
    review.comment = comment;
    await review.save()
    res.status(StatusCodes.OK).json({review})
}
const deleteReview = async(req, res)=>{
    const {id} = req.params
    const review = await Review.findOne({_id:id})
    if(!review){
        throw new NotFoundError(`No review matches the id:${id}`)
    }
    checkPermissions(req.user, review.user)
    await review.remove()
    res.status(StatusCodes.OK).json({msg:"Review deleted"})
}

const singleProductReviews = async(req, res)=>{
    const {id:productId} = req.params
    const reviews = await Review.find({product:productId})
    res.status(StatusCodes.OK).json({reviews, count:reviews.length})
}


module.exports = {
    createReview, getAllReviews,
     getSingleReview, updateReview,
      deleteReview, singleProductReviews
}