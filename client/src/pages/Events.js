import React, { Component } from 'react'
import EventList from '../components/EventList/EventList'
import Modal from '../components/Modal/Modal'
import Backdrop from '../components/Backdrop/Backdrop'
import Spinner from '../components/Spinner/Spinner'
import AuthContext from '../context/auth-context'
import './Events.css'

export default class EventsPage extends Component {
    state = {
        eventsList: [],
        creating: false,
        isLoading: false,
        selectedEvent: null
    }
    isActive = true;
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
                    mutation CreateEvent($title: String!, $desc: String!, $price: Float!, $date: String){
                        createEvent(eventInput: {title: $title, description: $desc, price: $price, date: $date}){
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
                    }`,
                    variables:{
                        title: title,
                        desc: description,
                        price: price,
                        date: date
                    }
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
        this.setState({isLoading: true});

        let requestBody = {
                query: `
                    query {
                        events {
                            _id
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
                if(this.isActive){
                    this.setState({eventsList: resData.data.events, isLoading: false})
                }
                
            })
            .catch(err => {
                console.log(err)
                this.setState({isLoading: false});
            })
    }
    startCreateEventHandler = () => {
        this.setState({creating: true})
    }
    modalConfirmHandler = () => {
        this.createEventHandler()
    }
    modalCancelHandler = () => {
        this.setState({creating: false, selectedEvent: null})
    }
    showDetailHandler = (eventId) => {
        this.setState(prevState => {
            const selectedEvent = prevState.eventsList.find( e => e._id === eventId)
            return {selectedEvent: selectedEvent}
        })
    }
    bookEventHandler = () => {
        const token = this.context.token

        let requestBody = {
            query: `
                    mutation BookEvent($id: ID!) {
                        bookEvent(eventId: $id){
                           _id
                           createdAt
                           updatedAt
                        }
                    }`,
                    variables: {
                        id: this.state.selectedEvent._id
                    }
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
            this.modalCancelHandler()
        })
        .catch(err => console.error(err))
    }
    componentWillUnmount(){
        this.isActive = false;
    }

    render() {
        return (
            <>
                <h1>The Events Page</h1>
                {this.context.token && 
                <div className="events-control">
                    <p>Share your Events!</p>
                    <button 
                    className="btn" 
                    onClick={()=> this.startCreateEventHandler()}>
                    Create event
                    </button>
                    {this.state.creating && <Backdrop/>}
                    {this.state.creating && 
                    <Modal 
                    title="Add Event" 
                    canCancel 
                    canConfirm 
                    onCancel={this.modalCancelHandler} 
                    onConfirm={this.modalConfirmHandler}
                    confirmText="Confirm">
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
                { this.state.selectedEvent && <Backdrop/>}
                {this.state.selectedEvent && 
                <Modal 
                title={this.state.selectedEvent.title}
                canCancel 
                canConfirm 
                isLoggedIn={this.context.token !== null}
                onCancel={this.modalCancelHandler} 
                onConfirm={this.bookEventHandler}
                confirmText="Book">
                <h1>{this.state.selectedEvent.title}</h1>
                <h2>${this.state.selectedEvent.price} - {new Date(this.state.selectedEvent.date).toLocaleDateString('de-DE')}</h2>
                <p>{this.state.selectedEvent.description}</p>
                </Modal>
                }
               {this.state.isLoading ? 
                 <Spinner/> : 
                 <EventList 
                 events={this.state.eventsList} 
                 isEventOwner={this.context.userId}
                 onViewDetail={this.showDetailHandler}    
                 />} 
          
            </>
        )
    }
}
