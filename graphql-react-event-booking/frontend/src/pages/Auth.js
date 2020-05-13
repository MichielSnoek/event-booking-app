import React, { Component } from 'react'
import './Auth.css'

export default class AuthPage extends Component {
    state = {
        isLogin: true
    }
    constructor(props){
        super(props);
        this.emailEl = React.createRef();
        this.passwordEl = React.createRef();
    }
    submitHandler = (e) => {
        e.preventDefault();
        const email = this.emailEl.current.value;
        const password = this.passwordEl.current.value;
        
        if(email.trim().length === 0 || password.trim().length === 0){
            return
        }
        let requestBody = {
            query: `
            query {
                login(email: "${email}", password: "${password}"){
                    userId
                    token
                    tokenExpiration
                }
            }`
        }
        if(!this.state.isLogin){
             requestBody = {
                query: `
                    mutation {
                        createUser(userInput: {email: "${email}", password: "${password}"}){
                            _id
                            email
                        }
                    }`
            }
        }
        
        fetch('http://localhost:8000/graphql', {
            method: 'POST',
            body: JSON.stringify(requestBody),
            headers:{
                'Content-Type':'application/json'
            }
        })
        .then(res => {return res.json()})
        .then(resData => console.log(resData.data))
        .catch(err => console.error(err))
    }

    switchToggle = () =>{
        this.setState(prevState => {
           return {isLogin: !prevState.isLogin}
        })
    }
    render() {
        return (
            <form className="auth-form" onSubmit={this.submitHandler}>
                <div className="form-control">
                    <label htmlFor="email">E-Mail</label>
                    <input type="email" id="email" ref={this.emailEl}/>
                </div>
                <div className="form-control">
                    <label htmlFor="password">Password</label>
                    <input type="password" id="password" ref={this.passwordEl}/>
                </div>
                <div className="form-actions">
                    <button type="submit">Submit</button>
                    <button type="button" onClick={this.switchToggle}>Switch to {this.state.isLogin ? 'Sign Up' : 'Login'}</button>
                </div>
            </form>
        )
    }
}
