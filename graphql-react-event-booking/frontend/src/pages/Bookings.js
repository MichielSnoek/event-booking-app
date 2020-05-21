import React, { Component } from 'react'
import Spinner from '../components/Spinner/Spinner'
import AuthContext from '../context/auth-context'
import BookingChart from '../components/BookingChart/BookingChart'
import BookingControl from '../components/BookingsControl/BookingsControl'
import BookingList from '../components/BookingList/BookingList'

export default class BookingsPage extends Component {
    static contextType = AuthContext

    state = {
        isLoading: false,
        bookings: [],
        outputType: 'list'
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
                               price
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
               mutation CancelBooking($id: ID!){
                    cancelBooking(bookingId: $id){
                    _id
                    title
                    date
                    }
                }`,
                variables: {
                    id: bookingId
                }
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
    outputTypeHandler = outputType => {
        if(outputType === 'list'){
            this.setState({outputType: 'list'})
        }
        else {
            this.setState({outputType: 'chart'})
        }
    }
    render() {
        let content = <Spinner/>
        if(!this.state.isLoading){
            content = (
                <>
                   <BookingControl 
                   activeOutputType={this.state.outputType} 
                   onChange={this.outputTypeHandler}/>
                    <div style={{textAlign: 'center'}}>
                        {this.state.outputType === 'list' ? 
                        <BookingList 
                        bookings={this.state.bookings} 
                        removeHandler={this.cancelBooking}/> :
                        <BookingChart 
                        bookings={this.state.bookings}/>}
                    </div>
                </>
            )
        }
        return (
            <div>
                <h1>The Bookings Page</h1>
                <ul>
                    {content}
                </ul>
            </div>
        )
    }
}
