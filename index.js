const { client } = require("./db/client");
const morgan = require('morgan')
const Express = require("express");
const app = Express();
const PORT = 1337
const apiErrorHandler = require('./api/error/api-error-handler')
const ApiError = require('./api/error/ApiError')
const cors = require('cors')

app.use(cors())

app.use(morgan('dev'))
app.use(Express.json())


app.use((req, res, next)=>{
    console.log('<___ Body Logger Start ___>')
    console.log(req.body)
    console.log('<___ Body Logger End ___')
    next()
})

const apiRouter = require('./api')
app.use('/api', apiRouter)

app.get('*', (req, res, next)=>{  
    next(ApiError.pageNotFound('Page Not Found'))
})
app.use(apiErrorHandler)

client.connect()

app.listen(PORT, ()=>{
    console.log(`Server is listening on PORT ${PORT}`)
})