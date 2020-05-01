const app = require("express")()
const bodyParser = require("body-parser")
const graphQlHttp = require("express-graphql")
const { buildSchema } = require("graphql")
const mongoose = require("mongoose")
const Event = require("./models/event")
app.use(bodyParser.json())

const events = [];

app.use('/graphql', graphQlHttp({
    schema: buildSchema(`
    type Event {
        _id: ID!
        title: String!
        description: String!
        price: Float!
        date: String!
    }
    input EventInput {
        title: String!
        description: String!
        price: Float!
        date: String!
    }
    type RootQuery {
            events: [Event!]!
    }

    type RootMutation {
            createEvent(eventInput: EventInput): Event
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
            // const event = {
            //     _id: Math.random().toString(),
            //     title: args.eventInput.title,
            //     description: args.eventInput.description,
            //     price: +args.eventInput.price,
            //     date: args.eventInput.date
            // }
            const event = new Event({
                title: args.eventInput.title,
                description: args.eventInput.description,
                price: +args.eventInput.price,
                date: new Date(args.eventInput.date)
            })
           return event.save()
            .then(result => {
                console.log(result)
                return {...result._doc};
            })
            .catch(e => {
                console.log(e)
            });      
        }
    },
    graphiql: true
}))

mongoose
// .connect(`mongodb+srv://${process.env.MONGO_USER}:${process.env.MONGO_PASSWORD}@cluster0-ujyk4.mongodb.net/${process.env.MONGO_DB}?retryWrites=true&w=majority`, { useNewUrlParser: true, useUnifiedTopology: true })
.connect(`mongodb://localhost:27017/${process.env.MONGO_DB}`, { useNewUrlParser: true, useUnifiedTopology: true })
.then(()=> app.listen(3000, () => console.log('Event booking server listening on port 3000')))
.catch(err => console.log(err))
