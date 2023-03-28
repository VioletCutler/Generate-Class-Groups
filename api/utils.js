const ApiError = require('./error/ApiError')

function requireAuthorization(req, res, next){
    if (!req.instructor){
        next(ApiError.unauthorizedRequest('You are not authorized to make this request'))
        return
        // res.status(403)
        // next({success: false,
        //     name: 'UnauthorizedRequest', message: 'You are not authorized'})
    }
    next()
}

module.exports = requireAuthorization