const ApiError = require('./error/ApiError')

function requireAuthorization(req, res, next){
    if (!req.instructor){
        next(ApiError.unauthorizedRequest('You are not authorized to make this request'))
        return
    }
    console.log('authorized request')
    next()
}

module.exports = requireAuthorization