const { client } = require("./db/client");
const Express = require("express");
const app = Express();
const PORT = 8080

app.use((req, res, next) => {
  console.log("request made to the server");
  next();
});

app.get('/', (req, res)=>{
    res.send('Hello World')
})
app.listen(PORT, ()=>{
    console.log(`Server is listening on PORT ${PORT}`)
})