// Created by Andrew Stam
import React from 'react';
import '../../node_modules/bootstrap/dist/css/bootstrap.css';
import {BrowserRouter as Router, Link, Route} from 'react-router-dom';
import SearchComponent from '../components/SearchComponent';
import DetailComponent from '../components/DetailComponent';
import LoginComponent from '../components/LoginComponent';
import RegisterComponent from '../components/RegisterComponent';
import ProfileComponent from '../components/ProfileComponent';

import UserService from '../services/UserService';
const service = UserService.getInstance();

export default class MovieClub extends React.Component {
    constructor(props) {
        super(props);
        const pathname = window.location.pathname;
        const paths = pathname.split('/');
        const pageName = paths[1];

        var id = 'null';
        var curUser = localStorage.getItem('curUser');
        if (curUser != "null") {
            id = curUser;
        }

        // Pages: /home, /login, /search, /details/{did}, /profile/{uid},
        //   /register
        this.state = {
            page: pageName,
            userId: id
        };
    }


    render() {
        return (
            <div className="container-fluid">
                <h1>Movie Club</h1>
                <Router>
                    <Link to="/search">Search</Link>
                    | <Link to="/profile">Profile</Link>
                    | <Link to="/login">Login</Link>
                    <Route path="/(|home|search)"
                           component={SearchComponent}/>
                    <Route path="/details/:did"
                           component={DetailComponent}/>
                    <Route path="/profile"
                           render={() => <ProfileComponent userId={this.state.userId}/>}/>
                    <Route path="/login"
                           render={() => <LoginComponent userId={this.state.userId} setUser={this.setUser}/>}/>
                    <Route path="/register"
                           render={() => <RegisterComponent user={this.state.userId} setUser={this.setUser}/>}/>
                </Router>
            </div>
        );
    }

    // Set the current user by the given ID
    setUser = id => {
        this.setState({userId: id});
        // save to local storage
        localStorage.setItem('curUser', id);
        console.log(localStorage.getItem('curUser'))
    }

    // Set the current page
    setPage = page =>
        this.setState({page: page})

    // Load any session attribute for current user
    loadUser = response => {
        console.log('load: ' + response.body);
        var setTo = response > 0 ? response : null;
        this.setState({userId: setTo});
        // save to local storage
        localStorage.setItem('curUser', setTo);
    }
}
