import React, { Component } from 'react'
import Modal from '../components/Modal/Modal'
import Backdrop from '../components/Backdrop/Backdrop'
import './Events.css'

export default class EventsPage extends Component {
    state = {
        eventsList: [],
        creating: false
    }

    startCreateEventHandler = () => {
        this.setState({creating: true})
    }
    modalConfirmHandler = () => {
        this.setState({creating: false})
    }
    modalCancelHandler = () => {
        this.setState({creating: false})
    }
    componentDidMount(){
        let requestBody = {
            query: `
                query {
                    events {
                        title
                        description
                        price
                        date
                    }
                }`
        }

        fetch('http://localhost:8000/graphql', {
            method: 'POST',
            body: JSON.stringify(requestBody),
            headers:{
                'Content-Type':'application/json'
            }
        })
        .then(res => {
            if(res.status !== 200){
                throw new Error('Failed')
            }
            return res.json()
        })
        .then(resData => {
            this.setState({eventsList: resData.data.events})
        })
    }
    render() {
        return (
            <>
                <h1>The Events Page</h1>
                <div className="events-control">
                    <p>Share your Events!</p>
                    <button className="btn" onClick={()=> this.startCreateEventHandler()}>Create event</button>
                    {this.state.creating && <Backdrop/>}
                    {this.state.creating && <Modal litle="Add Event" canCancel canConfirm onCancel={this.modalCancelHandler} onConfirm={this.modalConfirmHandler}>
                    Modal Content
                </Modal>}
                </div>
               
                {this.state.eventsList ? this.state.eventsList.map((event, key) => (
                    <div key={key}>
                        <h3>{event.title}</h3>
                        <p>{event.description}</p>
                        <p>{event.price}$</p>
                        <p>{event.date}</p>
                    </div>
                ))  : ''}
          
            </>
        )
    }
}
