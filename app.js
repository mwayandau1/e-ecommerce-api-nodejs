const express = require('express')
const app = express();
require('dotenv').config()
require('express-async-errors')
//DATABASE
const connectDB = require('./db/connect')
//COOKIE
//OTHER IMPORTS
const morgan = require('morgan')
const cookieParser = require('cookie-parser');
const fileUpload = require('express-fileupload')

//MIDDLEWARE
const notFoundMiddleWare = require('./middleware/not-found')
const errorHandlerMiddleWare = require('./middleware/error-handler')
//ROUTES
const authRoute = require('./routes/authRoutes')
const userRoute = require('./routes/userRoutes')
const productRoute = require('./routes/productRoute')
const reviewRoute = require('./routes/reviewRoute');
const orderRoute = require('./routes/orderRoute')


app.use(morgan('tiny'))
app.use(express.json())
app.use(cookieParser(process.env.JWT_SECRET))
app.use(express.static('/public'))
app.use(fileUpload())
app.use('/api/v1/auth', authRoute)
app.use('/api/v1/users', userRoute)
app.use('/api/v1/products', productRoute)
app.use('/api/v1/reviews', reviewRoute);
app.use('/api/v1/order', orderRoute)

app.get('/', (req, res)=>{
    res.send('hello welcome to this ecommerce project')
})




app.use(notFoundMiddleWare)
app.use(errorHandlerMiddleWare)

const PORT = process.env.PORT || 5000;
const start = async()=>{
    try{
        await connectDB(process.env.MONGO_URI)
    app.listen(PORT, ()=>console.log(`Up and running on port ${PORT}`))
    }
    catch(error){
        console.log(error)
    }
}

start();