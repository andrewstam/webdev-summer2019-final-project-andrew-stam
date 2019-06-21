// Created by Andrew Stam
import React from 'react';
import '../../node_modules/bootstrap/dist/css/bootstrap.css';
import {BrowserRouter as Router, Link, Route} from 'react-router-dom';
import SearchComponent from '../components/SearchComponent';
import HomeComponent from '../components/HomeComponent';
import DetailComponent from '../components/DetailComponent';
import LoginComponent from '../components/LoginComponent';
import RegisterComponent from '../components/RegisterComponent';
import ProfileComponent from '../components/ProfileComponent';
import ReviewComponent from '../components/ReviewComponent';
import MovieGroupComponent from '../components/MovieGroupComponent';
import '../../node_modules/font-awesome/css/font-awesome.min.css';
import './MovieClub.css';

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
            service.findUserGroups(id, this.loadGroups);
        }

        // Pages: /home, /login, /search, /search/{criteria}, /details/{did}, /profile/{uid},
        //   /register
        this.state = {
            userId: id,
            userObj: null,
            newestUser: null,
            page: 'home',
            profileId: id
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
            <div>
                <div className="wbdv-background-img"/>
                <div className="container-fluid">
                    <Router>
                        <Link to="/" className="wbdv-link" onClick={() => this.setState({page: 'home'})}>
                            <h1 className="wbdv-page-title">Stam Movie Club</h1>
                        </Link>
                        {this.state.userObj &&
                            <h6 className="float-right wbdv-current-user">Logged in as {this.state.userObj.username}</h6>
                        }
                        {this.state.userId !== null && this.state.page !== 'profile' &&
                            <button className="btn btn-primary float-right">
                                <Link to="/profile" className="wbdv-profile-btn wbdv-btn-shadow"
                                      onClick={() => this.setState({page: 'profile'})}>Profile</Link>
                            </button>
                        }
                        {this.state.userId !== null && this.state.page !== 'groups' &&
                            <button className="btn btn-info float-right wbdv-btn-margin">
                                <Link to="/groups" className="wbdv-profile-btn wbdv-btn-shadow"
                                      onClick={() => this.setState({page: 'groups'})}>Groups</Link>
                            </button>
                        }
                        {this.state.userId === null && this.state.page !== 'login' && this.state.page !== 'register' &&
                            <button className="btn btn-primary float-right wbdv-btn-margin">
                                <Link to="/login" className="wbdv-profile-btn wbdv-btn-shadow"
                                      onClick={() => this.setState({page: 'login'})}>Login</Link>
                            </button>
                        }
                        <Route path="/(|home)"
                               render={() => <HomeComponent userObj={this.state.userObj} nameText={nameText}
                                                            renderRoleText={this.renderRoleText} newestUser={this.state.newestUser}/>}/>
                        <Route path="/search/:criteria?"
                               component={SearchComponent}/>
                        <Route path="/details/:did"
                               render={() => <DetailComponent addFavorite={this.addFavorite} setPage={this.setPage}
                                                              removeFavorite={this.removeFavorite}/>}/>
                        <Route path="/profile"
                               render={() => <ProfileComponent userId={this.state.userId} logout={this.logout} userObj={this.state.userObj}
                                                               setPage={this.setPage} removeFavorite={this.removeFavorite}
                                                               setUser={this.setUser}/>}/>
                        <Route path="/login"
                               render={() => <LoginComponent userId={this.state.userId} setUser={this.setUser} setPage={this.setPage}/>}/>
                        <Route path="/register"
                               render={() => <RegisterComponent user={this.state.userId} setUser={this.setUser} setPage={this.setPage}
                                                                loadNewestUser={this.loadNewestUser}/>}/>
                        <Route path="/reviews"
                               render={() => <ReviewComponent setPage={this.setPage}/>}/>
                        <Route path="/groups"
                               render={() => <MovieGroupComponent userObj={this.state.userObj} setPage={this.setPage}/>}/>
                        {this.state.page === 'home' && this.state.userId !== null &&
                            <div className="wbdv-home-container">
                                <h4>Your next upcoming movie:</h4>

                            </div>
                        }
                    </Router>
                </div>
                <div className="wbdv-creator-text">Created by Andrew Stam, June 2019</div>
            </div>
        );
    }

    // Tell user what role they're in
    renderRoleText = () => {
        if (this.state.userObj.role === 'GroupLeader') {
            return (
                <div className="col-sm-4">
                    <h5 className="wbdv-role-text"><i>Group Leader</i></h5>
                    <div className="wbdv-role-text">As a Group Leader, you can create groups and add members
                    by their ID (ask a Group Member for their ID in person!) - Once the group is made, you can create movie
                    watch items, which includes what you're watching, where, and when!</div>
                </div>
            )
        }
        return (
            <div className="col-sm-4">
                <h5 className="wbdv-role-text"><i>Group Member</i></h5>
                <div className="wbdv-role-text">As a Group Member, you can review, rate, and add favorite movies. You can also
                be a part of groups (give a Group Leader your unique ID in person!) - Once you're in a group, you can add comments on
                watch items and tell others if you're attending!</div>
            </div>
        )
    }

    // Load groups for the logged in user
    loadGroups = json => {
        console.log(json)
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
        this.setState({userId: null, page: 'login', userObj: null});
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

    // Remove a movie from a user's favorites list
    removeFavorite = movieId => {
        service.removeFavorite(this.state.userId, movieId);
    }
}
