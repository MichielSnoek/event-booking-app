const bcrypt = require("bcrypt")

const Event = require("../../models/event")
const User = require("../../models/user")
const Booking = require("../../models/booking")

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
const singleEvent = async eventId => {
    try{
        const event = await Event.findById(eventId)
        return {
            ...event._doc,
            _id: event.id,
            creator: user.bind(this, event.creator)
        }
    }
    catch(err){
        throw err
    }
}
const singleUser = async userId =>{
    try{
        const user = await User.findById(userId)
        return {...user._doc, _id: user.id, createdEvents: events.bind(this, user._doc.createdEvents)}
    }
    catch(err){
        throw new Error(err)
    }
} 

module.exports = {
    bookings: async () => {
        try{
            const bookings = await Booking.find()
            return bookings.map(booking =>{
                const {_id, event, user, createdAt, updatedAt} = booking._doc
                return {...booking._doc, 
                    _id:booking.id, 
                    user: singleUser.bind(this, user),
                    event: singleEvent.bind(this, event),
                    createdAt: new Date(createdAt).toISOString(), 
                    updatedAt: new Date(updatedAt).toISOString()
                }
            })
        }
        catch(err){
            throw err
        }
    },
    events: async () => {
        try{
            const events = await Event.find()
            return events.map(event =>{
                const {_id, title, description, date, price, creator} = event._doc
                return {...event.doc, 
                    _id: _id.toString(),
                    title, description, 
                    date: new Date(date).toISOString(), 
                    price, 
                    creator: singleUser.bind(this, creator)}
            })
        }
        catch(err){
            throw err
        }
    },bookEvent: async (args)=>{
        // const fetchedEvent = Event.findOne({ _id: args.eventId})
        // console.log(fetchedEvent)
        const booking = new Booking({
            user: "5eaee2c2bfcc001316740835",
            event: args.eventId
        })
        const newBooking = await booking.save()
        return {
            ...newBooking._doc,
            _id: newBooking.id,
            createdAt: new Date(newBooking._doc.createdAt).toISOString(), 
            updatedAt: new Date(newBooking._doc.updatedAt).toISOString()
        };
    },cancelBooking: async (args)=>{
        try {
            const cancelledBooking =  await Booking.findById(args.bookingId).populate('event')
            const event = {
                ...cancelledBooking.event._doc,
                _id: cancelledBooking.id,
                creator: singleUser.bind(this, cancelledBooking.event._doc.creator)
            }
            console.log(event)
            await Booking.deleteOne({_id: args.bookingId})
            return event;
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