import React from 'react'
import EventItem from './EventItem/EventItem'
import './EventList.css'

const eventsList = props => {
    const events = props.events.map((event) => (
        <EventItem {...event} key={event._id} userId={props.isEventOwner}/>
    ));

   return (
   <ul className="events_list">
        {events}
    </ul>
    )
}

export default eventsList