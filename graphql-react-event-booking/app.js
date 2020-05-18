const app = require("express")()
const bodyParser = require("body-parser")
const graphQlHttp = require("express-graphql")
const mongoose = require("mongoose")
// const cors = require('cors')
const graphqlSchema = require("./graphql/schema/index")
const graphqlResolvers = require("./graphql/resolvers/index")
const isAuth = require("./middleware/is-auth")

// app.use(cors())
app.use(isAuth)// runs on every incoming request
app.use(bodyParser.json())
app.use((req, res, next) =>{
    res.setHeader('Access-Control-Allow-Origin', '*')
    res.setHeader('Access-Control-Allow-Methods', 'GET,POST,OPTIONS') // Browser send
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization')
    if(req.method === 'OPTIONS') {
        return res.sendStatus(200)
    }

    return next()
})
app.use('/graphql', graphQlHttp({
    schema: graphqlSchema,
    rootValue: graphqlResolvers,
    graphiql: true
}))

mongoose
.connect(`mongodb://localhost:27017/${process.env.MONGO_DB}`, { useNewUrlParser: true, useUnifiedTopology: true })
.then(()=> app.listen(8000, () => console.log('Event booking server listening on port 8000')))
.catch(err => console.log(err))
