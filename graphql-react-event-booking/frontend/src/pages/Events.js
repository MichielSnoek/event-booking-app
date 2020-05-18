import React, { Component } from 'react'
import Modal from '../components/Modal/Modal'
import Backdrop from '../components/Backdrop/Backdrop'
import AuthContext from '../context/auth-context'
import './Events.css'

export default class EventsPage extends Component {
    state = {
        eventsList: [],
        creating: false
    }
    static contextType = AuthContext

    constructor(props){
        super(props);

        this.titleRef = React.createRef();
        this.dateRef = React.createRef();
        this.priceRef = React.createRef();
        this.descriptionRef = React.createRef();
    }
    componentDidMount(){
    this.fetchEvents()
    }

    createEventHandler = () => {
        const token = this.context.token

        let title = this.titleRef.current.value;
        let price = +this.priceRef.current.value;
        let date = this.dateRef.current.value;
        let description = this.descriptionRef.current.value

        const event = {title, date, price, description}
        console.log(event)
       
        if(title.trim().length === 0 || date.trim().length === 0 || price <= 0 || description.trim().length === 0){
            return;
        }
        let requestBody = {
            query: `
                    mutation {
                        createEvent(eventInput: {title: "${title}", description: "${description}", price: ${price}, date: "${date}"}){
                            _id
                            title
                            price
                            date
                            description
                            creator {
                                _id
                                email
                            }
                        }
                    }`
        }

        fetch('http://localhost:8000/graphql', {
            method: 'POST',
            body: JSON.stringify(requestBody),
            headers:{
                'Content-Type':'application/json',
                'Authorization' : 'Bearer ' + token
            }
        })
        .then(res => {
            if(res.status !== 200){
                console.log(res)
                throw new Error('Failed')
            }
            return res.json()
        })
        .then(resData => {
            console.log(resData.data)
            this.fetchEvents()
        })
        .catch(err => console.error(err))
    
    }

    fetchEvents = () => {
    let requestBody = {
            query: `
                query {
                    events {
                        title
                        description
                        price
                        date
                        creator {
                            _id
                            email
                        }
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
    startCreateEventHandler = () => {
        this.setState({creating: true})
    }
    modalConfirmHandler = () => {
        this.createEventHandler()
    }
    modalCancelHandler = () => {
        this.setState({creating: false})
    }

    render() {
        const eventList = this.state.eventsList.map((event, key) => (
            <li className="events_list-item" key={key}>
                <h3>{event.title}</h3>
                <p>{event.description}</p>
                <p>{event.price}$</p>
                <p>{event.date}</p>
            </li>
        ))
        return (
            <>
                <h1>The Events Page</h1>
                {this.context.token && <div className="events-control">
                    <p>Share your Events!</p>
                    <button className="btn" onClick={()=> this.startCreateEventHandler()}>Create event</button>
                    {this.state.creating && <Backdrop/>}
                    {this.state.creating && <Modal title="Add Event" canCancel canConfirm onCancel={this.modalCancelHandler} onConfirm={this.modalConfirmHandler}>
                    <form>
                        <div className="form-control">
                            <label htmlFor="title">Title</label>
                            <input type="text" name="title" ref={this.titleRef}/>
                        </div>
                        <div className="form-control">
                            <label htmlFor="price">Price</label>
                            <input type="number" name="price" ref={this.priceRef}/>
                        </div>
                        <div className="form-control">
                            <label htmlFor="date">Date</label>
                            <input type="datetime-local" name="date" ref={this.dateRef}/>
                        </div>
                        <div className="form-control">
                            <label htmlFor="description">Description</label>
                            <textarea rows="4" ref={this.descriptionRef}></textarea>
                        </div>
                    </form>
                </Modal>}
                </div>}
               <ul className="events_list">
                   {this.state.eventsList ? eventList : ''}
               </ul>
                
          
            </>
        )
    }
}
