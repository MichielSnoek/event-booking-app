const bcrypt = require("bcrypt")
const Event = require("../../models/event")
const User = require("../../models/user")

const events = eventIds =>{
    return Event.find({_id: {$in: eventIds } })
    .then(events=>{
        return events.map(event=>{
            return {
                ...event._doc, 
                _id: event.id, 
                date: new Date(event._doc.date).toISOString(),
                creator: user.bind(this, event.creator)
            }
        })
    })
}

const user = userId =>{
   return User.findById(userId)
   .then(user => {
       return {...user._doc, _id: user.id, createdEvents: events.bind(this, user._doc.createdEvents)}
   })
   .catch(err=> console.log(err))
} 

module.exports = {
    events: () => {
       return Event.find()
       .then(events =>{
           console.log(events)
            return events.map(event =>{
                const {_id, title, description, date, price, creator} = event._doc
                return {...event.doc, _id: _id.toString(),title, description, date: new Date(event._doc.date).toISOString(), price, creator: user.bind(this, creator)}
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
            createdEvent = {...result._doc, creator: user.bind(this, result.creator)}
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
}