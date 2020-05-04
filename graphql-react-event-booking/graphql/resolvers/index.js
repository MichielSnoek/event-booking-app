const bcrypt = require("bcrypt")
const Event = require("../../models/event")
const User = require("../../models/user")

const events = async eventIds =>{

    try{
        const events = await Event.find({_id: {$in: eventIds } })
       return events.map(event=>{
            return {
                ...event._doc, 
                _id: event.id, 
                date: new Date(event._doc.date).toISOString(),
                creator: user.bind(this, event.creator)
            }
        })
    }
    catch(err){
        throw err
    }
    }

const user = async userId =>{
    try{
        const user = await User.findById(userId)
        return {...user._doc, _id: user.id, createdEvents: events.bind(this, user._doc.createdEvents)}
    }
    catch(err){
        throw new Error(err)
    }
} 

module.exports = {
    events: async () => {
        try{
            const events = await Event.find()
           console.log(events)
            return events.map(event =>{
                const {_id, title, description, date, price, creator} = event._doc
                return {...event.doc, _id: _id.toString(),title, description, date: new Date(event._doc.date).toISOString(), price, creator: user.bind(this, creator)}
            })
        }
        catch(err){
            throw err
        }
    },
    createEvent: async (args) => {
        const event = new Event({
            title: args.eventInput.title,
            description: args.eventInput.description,
            price: +args.eventInput.price,
            date: new Date(args.eventInput.date),
            creator: "5eaee2c2bfcc001316740835"
        })
         let createdEvent;
         try{
         const result = await event.save()
            createdEvent = {...result._doc, creator: user.bind(this, result.creator)}
           const foundUser= await User.findById('5eaee2c2bfcc001316740835')
                if(!foundUser){
                    throw new Error(" User not found")
                }
                foundUser.createdEvents.push(event)
               const userSaveResult = await foundUser.save()
               return createdEvent;
                // console.log(result)
                // return {...result._doc};
        }
       catch(err){
           throw err
       }
             
    },
    createUser: async (args) =>{  
        try{
       const existingUser = await User.findOne({email: args.userInput.email})
            if(existingUser){
                throw new Error(" User exist already")
            }
           const hashedPassword = await bcrypt.hash(args.userInput.password, 12)
    
            const user = new User({
                email: args.userInput.email,
                password: hashedPassword
            })
           const result = await user.save()
                console.log(result)
                return {...result._doc};
            }
            catch(err){
                throw err
            }
        }
}