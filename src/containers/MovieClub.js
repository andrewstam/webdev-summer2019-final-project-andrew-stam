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
import '../../node_modules/font-awesome/css/font-awesome.min.css';

import UserService from '../services/UserService';
const service = UserService.getInstance();

export default class MovieClub extends React.Component {
    constructor(props) {
        super(props);

        var id = null;
        var curUser = localStorage.getItem('curUser');
        if (curUser !== null) {
            id = curUser;
            service.findUserById(id, this.loadUser);
        }

        // Pages: /home, /login, /search, /details/{did}, /profile/{uid},
        //   /register
        this.state = {
            userId: id,
            userObj: null,
            newestUser: null,
            page: 'home'
        };

        service.findNewestUser(this.loadNewestUser);

        // TODO load list of groups, each can be clicked on
        // If leader: edit view shown, can see movies to watch, date for each
        //   can add/edit items, can add/edit members (search by username or id)
    }

    render() {
        // If not logged in, unused. If firstname is set, use that, otherwise user username
        var nameText = this.state.userObj ?
            (this.state.userObj.firstname !== '' ? this.state.userObj.firstname : this.state.userObj.username) : 'user';

        return (
            <div className="container-fluid">
                <h1>Movie Club</h1>
                <h2>Decide what movies to watch and when, with friends!</h2>
                {this.state.userObj !== null && this.state.page === 'home' &&
                    <h3>Welcome {nameText}.</h3>
                }
                <Router>
                    {this.state.newestUser !== null && this.state.page === 'home' &&
                        <div>
                            <h5>Check out our newest user, <Link to={`/profile/${this.state.newestUser.id}`}>
                                    {this.state.newestUser.username}</Link>!
                            </h5>
                        </div>
                    }
                    <Link to="/search" onClick={() => this.setState({page: 'home'})}>Search</Link>
                    | <Link to="/profile">Profile</Link>
                    | <Link to="/login">Login</Link>
                    | <Link to="/group">Group</Link>
                    <Route path="/(|home|search)"
                           component={SearchComponent}/>
                    <Route path="/details/:did"
                           render={() => <DetailComponent addFavorite={this.addFavorite} removeFavorite={this.removeFavorite}/>}/>
                    <Route path="/profile"
                           render={() => <ProfileComponent userId={this.state.userId} logout={this.logout}
                                                           setPage={this.setPage} removeFavorite={this.removeFavorite}/>}/>
                    <Route path="/login"
                           render={() => <LoginComponent userId={this.state.userId} setUser={this.setUser} setPage={this.setPage}/>}/>
                    <Route path="/register"
                           render={() => <RegisterComponent user={this.state.userId} setUser={this.setUser} setPage={this.setPage}/>}/>
                    <Route path="/group/:groupId"
                           render={() => <MovieGroupComponent userObj={this.state.userObj} setPage={this.setPage}/>}/>
                </Router>
            </div>
        );
    }

    // Set the current user by the given object and ID
    setUser = obj => {
        // save to local storage
        localStorage.setItem('curUser', obj.id);
        this.setState({userObj: obj, userId: obj.id});
    }

    // Load any session attribute for current user
    loadUser = json => {
        this.setState({userObj: json});
    }

    // Logout user, load login page
    logout = () => {
        localStorage.removeItem('curUser');
        this.setState({userId: null, page: 'login'});
    }

    // Display the user who joined the most recently
    loadNewestUser = json =>
        this.setState({newestUser: json})

    // Set the current page, used to determine when to show welcome message
    setPage = page =>
        this.setState({page: page})

    // Add a movie to a user's favorites list
    addFavorite = movieId => {
        service.addFavorite(this.state.userId, movieId);
    }

    // Add a movie to a user's favorites list
    removeFavorite = movieId => {
        service.removeFavorite(this.state.userId, movieId);
    }
}
