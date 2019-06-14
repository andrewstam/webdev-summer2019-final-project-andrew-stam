// Created by Andrew Stam
import React from 'react';
import '../../node_modules/bootstrap/dist/css/bootstrap.css';
import {BrowserRouter as Router, Link, Route} from 'react-router-dom';
import SearchComponent from '../components/SearchComponent';
import DetailComponent from '../components/DetailComponent';
import LoginComponent from '../components/LoginComponent';
import RegisterComponent from '../components/RegisterComponent';
import ProfileComponent from '../components/ProfileComponent';

export default class MovieClub extends React.Component {
    constructor(props) {
        super(props);
        const pathname = window.location.pathname;
        const paths = pathname.split('/');
        const pageName = paths[1];

        // Pages: /home, /login, /search, /details/{did}, /profile/{uid},
        //   /register
        this.state = {
            page: pageName,
            user: null
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
                           render={() => <ProfileComponent user={this.state.user}/>}/>
                    <Route path="/login"
                           render={() => <LoginComponent user={this.state.user} setUser={this.setUser}/>}/>
                    <Route path="/register"
                           render={() => <RegisterComponent user={this.state.user}/>}/>
                </Router>
            </div>
        );
    }

    // Set the current user
    setUser = user =>
        this.setState({user: user})

    // Set the current page
    setPage = page =>
        this.setState({page: page})
}
