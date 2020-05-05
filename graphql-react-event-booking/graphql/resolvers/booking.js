const {transformBooking, transformEvent}= require("./merge")
const Booking = require("../../models/booking")


module.exports = {
    bookings: async () => {
        try{
            const bookings = await Booking.find()
            return bookings.map(booking =>{
                return transformBooking(booking)
            })
        }
        catch(err){
            throw err
        }
    },
    bookEvent: async (args)=>{
        // const fetchedEvent = Event.findOne({ _id: args.eventId})
        // console.log(fetchedEvent)
        const booking = new Booking({
            user: "5eaee2c2bfcc001316740835",
            event: args.eventId
        })
        const newBooking = await booking.save()
        return transformBooking(newBooking);
    },
    cancelBooking: async (args)=> {
        try {
            const cancelledBooking =  await Booking.findById(args.bookingId).populate('event')
            const event = transformEvent(cancelledBooking.event)
            await Booking.deleteOne({_id: args.bookingId})
            console.log(event)
            return event;
        }
        catch(err){
            throw err
        }
    }
}