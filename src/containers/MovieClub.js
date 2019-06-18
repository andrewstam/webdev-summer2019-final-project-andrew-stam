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
        }

        // Pages: /home, /login, /search, /search/{criteria}, /details/{did}, /profile/{uid},
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
                        {this.state.userId !== null &&
                            <button className="btn btn-secondary float-right">
                                <Link to="/profile" className="wbdv-profile-btn"
                                      onClick={() => this.setState({page: 'profile'})}>Profile</Link>
                            </button>
                        }
                        {this.state.userId === null && this.state.page !== 'login' && this.state.page !== 'register' &&
                            <button className="btn btn-info float-right">
                                <Link to="/login" className="wbdv-profile-btn"
                                      onClick={() => this.setState({page: 'login'})}>Login</Link>
                            </button>
                        }
                        <Route path="/(|home)"
                               render={() => <HomeComponent userObj={this.state.userObj} nameText={nameText}
                                                            renderRoleText={this.renderRoleText} newestUser={this.state.newestUser}/>}/>
                        <Route path="/search/:criteria?"
                               component={SearchComponent}/>
                        <Route path="/details/:did"
                               render={() => <DetailComponent addFavorite={this.addFavorite} removeFavorite={this.removeFavorite}/>}/>
                        <Route path="/profile"
                               render={() => <ProfileComponent userId={this.state.userId} logout={this.logout} userObj={this.state.userObj}
                                                               setPage={this.setPage} removeFavorite={this.removeFavorite} setUser={this.setUser}/>}/>
                        <Route path="/login"
                               render={() => <LoginComponent userId={this.state.userId} setUser={this.setUser} setPage={this.setPage}/>}/>
                        <Route path="/register"
                               render={() => <RegisterComponent user={this.state.userId} setUser={this.setUser} setPage={this.setPage}
                                                                loadNewestUser={this.loadNewestUser}/>}/>
                        <Route path="/group/:groupId"
                               render={() => <MovieGroupComponent userObj={this.state.userObj} setPage={this.setPage}/>}/>
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
                <h5 className="wbdv-role-text"><i>Group Leader</i></h5>
            )
        }
        return (
            <h5 className="wbdv-role-text">Group Member</h5>
        )
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

    // Add a movie to a user's favorites list
    removeFavorite = movieId => {
        service.removeFavorite(this.state.userId, movieId);
    }
}
