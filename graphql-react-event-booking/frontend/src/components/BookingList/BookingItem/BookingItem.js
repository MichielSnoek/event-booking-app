import React from 'react';
import './BookingItem.css'
const bookingItem = (props) => {
    return (
        <li className="booking_item"> 
           <p>{props.event.title} ({props.event.price}) - {new Date(props.event.date).toLocaleDateString()} </p> 
            <button className="btn" onClick={()=> props.cancelBooking(props._id)}>Cancel</button>
        </li>
    )
}

export default bookingItem;