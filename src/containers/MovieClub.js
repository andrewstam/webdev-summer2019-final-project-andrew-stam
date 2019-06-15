// Created by Andrew Stam
import React from 'react';
import '../../node_modules/bootstrap/dist/css/bootstrap.css';
import {BrowserRouter as Router, Link, Route} from 'react-router-dom';
import SearchComponent from '../components/SearchComponent';
import DetailComponent from '../components/DetailComponent';
import LoginComponent from '../components/LoginComponent';
import RegisterComponent from '../components/RegisterComponent';
import ProfileComponent from '../components/ProfileComponent';
import MovieGroupComponent from '../components/MovieGroupComponent';

import UserService from '../services/UserService';
const service = UserService.getInstance();

export default class MovieClub extends React.Component {
    constructor(props) {
        super(props);

        var id = null;
        var curUser = localStorage.getItem('curUser');
        if (curUser !== null) {
            console.log('CUR ' + curUser)
            id = curUser;
            service.findUserById(id, this.loadUser);
        }

        // Pages: /home, /login, /search, /details/{did}, /profile/{uid},
        //   /register
        this.state = {
            userId: id,
            userObj: null
        };

        // TODO load list of groups, each can be clicked on
        // If leader: edit view shown, can see movies to watch, date for each
        //   can add/edit items, can add/edit members (search by username or id)
    }

    render() {
        return (
            <div className="container-fluid">
                <h1>Movie Club</h1>
                <Router>
                    <Link to="/search">Search</Link>
                    | <Link to="/profile">Profile</Link>
                    | <Link to="/login">Login</Link>
                    | <Link to="/group">Group</Link>
                    <Route path="/(|home|search)"
                           component={SearchComponent}/>
                    <Route path="/details/:did"
                           component={DetailComponent}/>
                    <Route path="/profile"
                           render={() => <ProfileComponent userId={this.state.userId} logout={this.logout}/>}/>
                    <Route path="/login"
                           render={() => <LoginComponent userId={this.state.userId} setUser={this.setUser}/>}/>
                    <Route path="/register"
                           render={() => <RegisterComponent user={this.state.userId} setUser={this.setUser}/>}/>
                    <Route path="/group/:groupId"
                           render={() => <MovieGroupComponent userObj={this.state.userObj}/>}/>
                </Router>
            </div>
        );
    }

    // Set the current user by the given object and ID
    setUser = obj => {
        this.setState({userObj: obj, userId: obj.id});
        // save to local storage
        localStorage.setItem('curUser', obj.id);
    }

    // Load any session attribute for current user
    loadUser = json => {
        this.setState({userObj: json});
        console.log('loaded user: ' + JSON.stringify(json))
    }

    // Logout user, load login page
    logout = () => {
        localStorage.removeItem('curUser');
        this.setState({userId: null, page: 'login'});
    }
}
