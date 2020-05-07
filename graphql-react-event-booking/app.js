const app = require("express")()
const bodyParser = require("body-parser")
const graphQlHttp = require("express-graphql")
const mongoose = require("mongoose")

const graphqlSchema = require("./graphql/schema/index")
const graphqlResolvers = require("./graphql/resolvers/index")
const isAuth = require("./middleware/is-auth")

app.use(bodyParser.json())
app.use(isAuth)// runs on every incoming request
app.use('/graphql', graphQlHttp({
    schema: graphqlSchema,
    rootValue: graphqlResolvers,
    graphiql: true
}))

mongoose
.connect(`mongodb://localhost:27017/${process.env.MONGO_DB}`, { useNewUrlParser: true, useUnifiedTopology: true })
.then(()=> app.listen(3000, () => console.log('Event booking server listening on port 3000')))
.catch(err => console.log(err))
