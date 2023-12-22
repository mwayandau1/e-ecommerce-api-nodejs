const { BadRequestError, UnauthenticatedError, UnauthorizedError } = require("../errors");
const { verifyToken } = require("../utils/jwt");



const authenticateUser = async(req, res, next)=>{
    const token = req.signedCookies.token;
    if(!token ){
        throw new UnauthenticatedError("Authentication failed")
    }
    try{
    const {name, id, role} = verifyToken({payload: token })
    req.user = {name, id, role}
    next()
}
catch(err){
    throw new UnauthenticatedError("Token invalid")

}
}

const authorizePermissions = (...roles)=>{
    return (req, res, next)=>{
        if(!roles.includes(req.user.role)){
            throw new UnauthorizedError("Unauthorized to access this route")
        }
        next()
    }

}





module.exports ={ authenticateUser, authorizePermissions};