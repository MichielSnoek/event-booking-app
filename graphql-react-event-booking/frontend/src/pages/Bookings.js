import React, { Component } from 'react'
import Spinner from '../components/Spinner/Spinner'
import AuthContext from '../context/auth-context'

export default class BookingsPage extends Component {
    static contextType = AuthContext

    state = {
        isLoading: false,
        bookings: []
    }

    componentDidMount(){
        this.fetchBookings()
    }

    fetchBookings = () =>{
        this.setState({isLoading: true});

        let requestBody = {
                query: `
                    query {
                        bookings {
                            _id
                           createdAt
                           event {
                               _id
                               title
                               date
                           }
                        }
                    }`
            }

            fetch('http://localhost:8000/graphql', {
                method: 'POST',
                body: JSON.stringify(requestBody),
                headers:{
                    'Content-Type':'application/json',
                    'Authorization' : 'Bearer ' + this.context.token
                }
            })
            .then(res => {
                if(res.status !== 200){
                    throw new Error('Failed')
                }
                return res.json()
            })
            .then(resData => {
                    this.setState({bookings: resData.data.bookings, isLoading: false})           
            })
            .catch(err => {
                console.log(err)
                this.setState({isLoading: false});
            })
    }

    cancelBooking = (bookingId) => {
        //
        let requestBody = {
            query: `
               mutation {
                    cancelBooking(bookingId: "${bookingId}"){
                    _id
                    title
                    date
                    }
                }`
        }

        fetch('http://localhost:8000/graphql', {
            method: 'POST',
            body: JSON.stringify(requestBody),
            headers:{
                'Content-Type':'application/json',
                'Authorization' : 'Bearer ' + this.context.token
            }
        })
        .then(res => {
            if(res.status !== 200){
                throw new Error('Failed')
            }
            return res.json()
        })
        .then(resData => {
               console.log(resData.data.cancelBooking)     
               this.setState(prevState => {
                   const updatedBookings = prevState.bookings.filter(booking => {
                       return booking._id !== bookingId
                   } )
                   return {bookings: updatedBookings,isLoading: false}
               })     
        })
        .catch(err => {
            console.log(err)
            this.setState({isLoading: false});
        })
    }

    render() {
        if(this.state.isLoading){
            return <Spinner/>
        }
        return (
            <div>
                <h1>The Bookings Page</h1>
                <ul>
                    {this.state.bookings.map(booking => (
                        <li key={booking._id}> 
                            {booking.event.title} - {new Date(booking.event.date).toLocaleDateString()} 
                            <button onClick={()=>this.cancelBooking(booking._id)}>Cancel</button>
                        </li>
                    ))}
                </ul>
            </div>
        )
    }
}
