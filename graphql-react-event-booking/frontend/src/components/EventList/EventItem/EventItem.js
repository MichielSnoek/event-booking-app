import React from 'react'
import './EventItem.css'

const eventsItem = props => (
    <li className="events_list-item" key={props._id}>
            <div>
                <h1>{props.title}</h1>
                {/* <p>{props.description}</p>
                <p>{props.price}$</p> */}
                <p>{new Date(props.date).toLocaleDateString('de-DE')}</p>
            </div>
            <div>
                {props.userId !== props.creator._id ? 
                <button className="btn" onClick={props.onDetails.bind(this, props._id)}>View details</button> :
                <p>You're the owner</p>
                }
            </div>
                
    </li>
)

export default eventsItem