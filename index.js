const { client } = require("./db/client");
const morgan = require('morgan')
const Express = require("express");
const app = Express();
const PORT = 1337

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
    res.status(404).send({error: '404 - Not Found', message: 'No route found for the requested URL'})
})

app.use((error, req, res, next)=> {
    console.log('Error', error)
    res.send({error: error.message, name: error.name, message: error.message, table: error.table})
})

client.connect()

app.listen(PORT, ()=>{
    console.log(`Server is listening on PORT ${PORT}`)
})