function requireAuthorization(req, res, next){
    if (!req.instructor){
        res.status(403)
        next({success: false,
            name: 'UnauthorizedRequest', message: 'You are not authorized'})
    }
    next()
}

module.exports = requireAuthorization