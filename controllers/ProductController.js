const { StatusCodes } = require('http-status-codes');
const Product = require('../models/productModel');
const { NotFoundError, BadRequestError } = require('../errors');
const path = require('path')

const createProduct = async(req, res)=>{
    req.body.user = req.user.id
    const product =await Product.create(req.body);
    res.status(StatusCodes.CREATED).json({product})
}

const getAllProducts = async(req, res)=>{
    const products = await Product.find({})
    res.status(StatusCodes.OK).json({products, count:products.length})
}
const getSingleProduct = async(req, res)=>{
    const product = await Product.findOne({_id:req.params.id}).populate('reviews')
    if(!product){
        throw new NotFoundError("Not product matches this ID")
    }
    res.status(StatusCodes.OK).json({product})
}

const updateProduct = async(req, res)=>{
    const { id: productId } = req.params;

    const product = await Product.findOneAndUpdate({ _id: productId }, req.body, {
      new: true,
      runValidators: true,
    });

    if (!product) {
      throw new NotFoundError(`No product with id : ${productId}`);
    }

    res.status(StatusCodes.OK).json({ product });
  };



const deleteProduct = async(req, res)=>{
    const {id:productId} = req.params
    const product = await Product.findOne({_id:productId})
    if(!product){
        throw new NotFoundError(`No product matches ID:${req.params.id}`)
    }
    await product.remove()
    res.status(StatusCodes.OK).json({msg:"Product deleted"})
}

const uploadImage = async(req, res)=>{
    if(!req.files){
        throw new BadRequestError("No image uploaded")
    }
    const productImage = req.files.image;
    if(!productImage.mimetype.startsWith('image')){
        throw new BadRequestError("Please upload an image")
    }
    const maxSize = 1024 * 1024
    if(productImage.size > maxSize){
        throw new BadRequestError("Please upload an image less than 1MB")
    }
    const imagePath = path.join(__dirname, '../public/uploads/' + `${productImage.name}`)
    await productImage.mv(imagePath)
    res.status(StatusCodes.OK).json({image:`/uploads/${productImage.name}`})
}

module.exports = {createProduct, getAllProducts,
     getSingleProduct, updateProduct, deleteProduct, uploadImage}




