const app = require("express")()
const bodyParser = require("body-parser")
const graphQlHttp = require("express-graphql")
const { buildSchema } = require("graphql")
const mongoose = require("mongoose")
const bcrypt = require("bcrypt")
const Event = require("./models/event")
const User = require("./models/user")

app.use(bodyParser.json())
app.use('/graphql', graphQlHttp({
    schema: buildSchema(`
    type Event {
        _id: ID!
        title: String!
        description: String!
        price: Float!
        date: String!
    }
    type User {
        _id: ID!
        email: String!
        password: String
    }
    input EventInput {
        title: String!
        description: String!
        price: Float!
        date: String!
    }

    input UserInput {
        email: String!
        password: String!
    }
    type RootQuery {
            events: [Event!]!
    }

    type RootMutation {
            createEvent(eventInput: EventInput): Event
            createUser(userInput: UserInput): User
    }
        schema {
            query: RootQuery,
            mutation: RootMutation
        }
    `),
    rootValue: {
        events: () => {
           return Event.find().then(events =>{
                return events.map(event =>{
                    const {_id, title, description, date, price} = event._doc
                    return {...event.doc, _id: _id.toString(),title, description, date, price}
                })
            })
            .catch(e => console.log(e))
        },
        createEvent: (args) => {
            const event = new Event({
                title: args.eventInput.title,
                description: args.eventInput.description,
                price: +args.eventInput.price,
                date: new Date(args.eventInput.date),
                creator: "5eaee2c2bfcc001316740835"
            })
             let createdEvent;
             return event.save()
            .then(result => {
                createdEvent = {...result._doc}
               return User.findById('5eaee2c2bfcc001316740835')
               .then(user => {
                    if(!user){
                        throw new Error(" User not found")
                    }
                   user.createdEvents.push(event)
                   return user.save()
               })
                console.log(result)
                return {...result._doc};
            })
            .then(result =>{    
                return createdEvent;
            })
            .catch(e => {
                console.log(e)
            });      
        },
        createUser: (args) =>{  
           return User.findOne({email: args.userInput.email})
            .then(user =>{
                if(user){
                    throw new Error(" User exist already")
                }
                return bcrypt.hash(args.userInput.password, 12)
            })
            
            .then(hashedPassword => {
                const user = new User({
                    email: args.userInput.email,
                    password: hashedPassword
                })
                return user.save()
                .then(result => {
                    console.log(result)
                    return {...result._doc};
                })
                .catch(err => console.log(err))
            })  
        }
    },
    graphiql: true
}))

mongoose
// .connect(`mongodb+srv://${process.env.MONGO_USER}:${process.env.MONGO_PASSWORD}@cluster0-ujyk4.mongodb.net/${process.env.MONGO_DB}?retryWrites=true&w=majority`, { useNewUrlParser: true, useUnifiedTopology: true })
.connect(`mongodb://localhost:27017/${process.env.MONGO_DB}`, { useNewUrlParser: true, useUnifiedTopology: true })
.then(()=> app.listen(3000, () => console.log('Event booking server listening on port 3000')))
.catch(err => console.log(err))
