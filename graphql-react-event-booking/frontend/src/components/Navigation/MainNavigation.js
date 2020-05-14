import React from 'react'
import {NavLink} from 'react-router-dom'
import AuthContext from '../../context/auth-context'
import './MainNavigation.css'
import { useContext } from 'react'

export default function MainNavigation(props) {
        const context = useContext(AuthContext)
            return (
                <header className="main-navigation">
                    <div className="main-navigation_logo">
                        <h1>The Navbar</h1>
                    </div>
                    <nav className="main-naivgation_items">
                        <ul>
                            {!context.token && <li><NavLink to="/auth">Auth</NavLink></li>}
                            <li><NavLink to="/events">Events</NavLink></li>
                            {context.token && <li><NavLink to="/bookings">Bookings</NavLink></li>}
                        </ul>
                    </nav> 
                </header>
            )}

