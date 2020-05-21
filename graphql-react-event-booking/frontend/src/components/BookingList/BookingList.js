import React from 'react'
import BookingItem from './BookingItem/BookingItem'

const bookingList = (props) => {
    return (
        <ul>
            {props.bookings.map(booking => (
                            <BookingItem {...booking} key={booking._id} cancelBooking={props.removeHandler}/>
                        ))}
        </ul>
    )
}

export default bookingList;