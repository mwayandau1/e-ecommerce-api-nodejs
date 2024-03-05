const Order = require('../models/orderModel')
const Product = require('../models/productModel')
const {authenticateUser, authorizePermission} = require('../middleware/authentication');
const { BadRequestError, NotFoundError } = require('../errors');
const { StatusCodes } = require('http-status-codes');
const checkPermissions = require('../utils/checkPermissions')

const fakeStripeAPI = async ({amount, currency})=>{
    const clientSecret = "someNumberStripe"
    return {clientSecret, amount}
}

const createOrder = async(req, res)=>{
    const {items:cartItems, shippingFee, tax} = req.body;
    if(!cartItems || cartItems.length <1){
        throw new BadRequestError("There is no cart item ")
    }
    if(!shippingFee || !tax){
        throw new BadRequestError("Please provide shipping fee and tax")
    }
    let orderItems = [];
    let subtotal = 0;
    for(const item of cartItems){
        const dbProduct = await Product.findOne({_id:item.product});
        if(!dbProduct){
            throw new NotFoundError(`No product with id:${item.product}`)
        }
        const {name, price, image, _id}= dbProduct;
        const singleProduct = {
            amount:item.amount,
            name, price, image, product:_id
        }
        orderItems = [...orderItems, singleProduct]
        subtotal +=item.amount * price
    }
    const total = tax + shippingFee + subtotal;
    const paymentIntent = await fakeStripeAPI({
        amount:total,
        currency:"usd"
    })
    const order = await Order.create({
        orderItems, total, subtotal, tax, shippingFee,
        clientSecret:paymentIntent.clientSecret,
        user:req.user.id
    })
    res.status(StatusCodes.CREATED).json({order, clientSecret: order.clientSecret})
}

const getAllOrders = async(req, res)=>{
    const orders = await Order.find({});
    res.status(StatusCodes.OK).json({ orders, count: orders.length });
}
const getSingleOrder = async(req, res)=>{
    const {id} = req.params
    const order = await Order.findOne({_id:id})
    if(!order){
        throw new NotFoundError(`No order with id ${id} exist`)
    }
    checkPermissions(req.user, order.user)
    res.status(StatusCodes.OK).json({order})
}
const getCurrentUserOrders = async(req, res)=>{
    const orders = await Order.find({user:req.user.id})
    res.status(StatusCodes.OK).json({orders, count:orders.length})
}


const updateOrder = async(req, res)=>{
    const {id} = req.params
    const {paymentIntentId} = req.body
    const order = await Order.findOne({_id:id})
    if(!order){
        throw new NotFoundError(`No order with id ${id} exist`)
    }
    checkPermissions(req.user, order.user)
    order.paymentIntentId = paymentIntentId
    order.status = "paid";
    await order.save()
    res.status(StatusCodes.OK).json({order})
}


module.exports = {createOrder, getAllOrders,
    getSingleOrder, updateOrder, getCurrentUserOrders }