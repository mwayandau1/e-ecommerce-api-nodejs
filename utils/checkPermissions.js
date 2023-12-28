const { UnauthorizedError } = require("../errors");


const checkPermissions = (requestUser, resourceUserId)=>{
    if(requestUser.role === 'admin') return;
    if(requestUser.id === resourceUserId.toString()) return;
    throw new UnauthorizedError("not authorized to access this route")

}


module.exports = checkPermissions