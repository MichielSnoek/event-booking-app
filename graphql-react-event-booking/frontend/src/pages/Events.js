import React, { Component } from 'react'

export default class EventsPage extends Component {
    state = {
        eventsList: []
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
            <div>
                <h1>The Events Page</h1>
                {this.state.eventsList ? this.state.eventsList.map((event, key) => (
                    <div key={key}>
                        <h3>{event.title}</h3>
                        <p>{event.description}</p>
                        <p>{event.price}$</p>
                        <p>{event.date}</p>
                    </div>
                ))  : ''}
            </div>
        )
    }
}
