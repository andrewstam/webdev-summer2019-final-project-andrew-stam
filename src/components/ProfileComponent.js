// Created by Andrew Stam
import React from 'react';
import {Redirect, BrowserRouter as Router, Link} from 'react-router-dom';
import UserService from '../services/UserService';
const service = UserService.getInstance();

export default class ProfileComponent extends React.Component {
    constructor(props) {
        super(props);

        const pathname = window.location.pathname;
        const paths = pathname.split('/');
        // If there's an ID, load that user. Otherwise, no ID so load logged in user's info
        var id = paths.length > 2 ? paths[2] : 'own';

        if (id === 'own') {
            // load own profile
            id = localStorage.getItem('curUser');
        }

        // profile to load
        if (id !== null) {
            service.findUserById(id, this.loadUserData);
            service.findFollowers(id, this.followersCallback);
            service.findFollowing(id, this.followingCallback);
            service.findFavorites(id, this.favoritesCallback);
        }

        this.state = {
            pageId: id,
            curUser: localStorage.getItem('curUser'),
            logoutClick: false,
            username: '',
            password: 'HIDDEN',
            firstname: '',
            lastname: '',
            dob: '',
            role: '',
            email: '',
            followers: [],
            following: [],
            favorites: [],
            favIdMap: {}
        };

        this.props.setPage('profile');
    }

    componentWillReceiveProps(props) {
        if (this.props !== props) {
            this.props = props;
        }
    }

    // Once found user from backend, update page
    loadUserData = json => {
        // Public data
        this.setState({
            username: json.username,
            firstname: json.firstname,
            lastname: json.lastname,
            role: json.role
        });
        // Private data (only can see if own profile)
        if (this.state.pageId === this.state.curUser) {
            this.setState({
                dob: json.dob,
                email: json.email
            });
        }
    }

    // Set state to given followers after backend load
    followersCallback = json => {
        this.setState({followers: json});
    }

    // Set state to given following after backend load
    followingCallback = json => {
        this.setState({following: json});
    }

    // Set state to given favorites after backend load
    favoritesCallback = json => {
        // Build new array: data looks like ['1,0,tt0335266', '1,1,tt1856191']
        var arr = json;
        for (var i = 0; i < json.length; i++) {
            var tempArr = json[i].split(',');
            arr[i] = tempArr[1];
            // arr[i] now contains the IDs, so fetch title from API
            this.loadTitleFromAPI(arr[i]);
        }
    }

    // Update the user stored in the backend -> only the current user can update
    updateBackend = user => {
        user.id = localStorage.getItem('curUser');
        service.updateUser(user, user.id);
    }

    // Change this user's first name
    changeFirstName = name => {
        this.setState({firstname: name});
        var user = {
            id: this.state.pageId,
            username: this.state.username,
            password: this.state.password,
            firstname: name,
            lastname: this.state.lastname,
            dob: this.state.dob,
            role: this.state.role,
            email: this.state.email
        };
        this.updateBackend(user);
    }

    // Change this user's last name
    changeLastName = name => {
        this.setState({lastname: name});
        var user = {
            id: this.state.pageId,
            username: this.state.username,
            password: this.state.password,
            firstname: this.state.firstname,
            lastname: name,
            dob: this.state.dob,
            role: this.state.role,
            email: this.state.email
        };
        this.updateBackend(user);
    }

    // Change this user's role
    changeRole = role => {
        this.setState({role: role});
        var user = {
            id: this.state.pageId,
            username: this.state.username,
            password: this.state.password,
            firstname: this.state.firstname,
            lastname: this.state.lastname,
            dob: this.state.dob,
            role: role,
            email: this.state.email
        };
        this.updateBackend(user);
    }

    // Change this user's email
    changeEmail = email => {
        this.setState({email: email});
        var user = {
            id: this.state.pageId,
            username: this.state.username,
            password: this.state.password,
            firstname: this.state.firstname,
            lastname: this.state.lastname,
            dob: this.state.dob,
            role: this.state.role,
            email: email
        };
        this.updateBackend(user);
    }

    // Change this user's date of birth
    changeDob = dob => {
        this.setState({user: {dob: dob}});
        var user = {
            id: this.state.pageId,
            username: this.state.username,
            password: this.state.password,
            firstname: this.state.firstname,
            lastname: this.state.lastname,
            dob: dob,
            role: this.state.role,
            email: this.state.email
        };
        this.updateBackend(user);
    }

    // Enable input fields, show private info
    renderMyPage = () => {
        if (this.props.newUser) {
            service.findUserById(this.props.newUser, this.loadUserData);
        }
        return (<div>
            <label htmlFor="fname">First name</label>
            <input type="text" className="form-control" id="fname"
                   onChange={e => this.changeFirstName(e.target.value)}
                   defaultValue={this.state.firstname}/>
            <label htmlFor="lname">Last name</label>
            <input type="text" className="form-control" id="lname"
                   onChange={e => this.changeLastName(e.target.value)}
                   defaultValue={this.state.lastname}/>
            <label htmlFor="emailf">Email</label>
            <input type="email" className="form-control" id="emailf"
                   onChange={e => this.changeEmail(e.target.value)}
                   defaultValue={this.state.email}/>
            <label htmlFor="rolef">Role</label>
            <select className="form-control" id="rolef"
                   onChange={e => this.changeRole(e.target.value)}
                   value={this.state.role}>
                <option value="GroupMember">Group Member</option>
                <option value="GroupLeader">Group Leader</option>
            </select>
            <label htmlFor="dobf">Date of Birth</label>
            <input type="date" className="form-control" id="dobf"
                   onChange={e => this.changeDob(e.target.value)}
                   defaultValue={this.state.dob}/>
            {this.renderLinks()}
        </div>)
    }

    // Disable input fields, hide private info
    renderOtherPage = () => {
        return (<div>
            <label htmlFor="fname">First name</label>
            <input type="text" className="form-control" id="fname" disabled
                   onChange={e => this.changeFirstName(e.target.value)}
                   defaultValue={this.state.firstname}/>
            <label htmlFor="lname">Last name</label>
            <input type="text" className="form-control" id="lname" disabled
                   onChange={e => this.changeLastName(e.target.value)}
                   defaultValue={this.state.lastname}/>
            <label htmlFor="rolef">Role</label>
            <select className="form-control" id="rolef" disabled
                   onChange={e => this.changeRole(e.target.value)}
                   value={this.state.role}>
                <option value="GroupMember">Group Member</option>
                <option value="GroupLeader">Group Leader</option>
            </select>
            {this.renderLinks()}
        </div>)
    }

    // Renders following list, followers list, and favorites list
    renderLinks = () => {
        return (
            <div>
                <h6>Following:</h6>
                {this.state.following.length > 0 &&
                    <ul>
                        {this.state.following.map((m, key) => <li key={key}>{m.username}</li>)}
                    </ul>
                }
                <h6>Followers:</h6>
                {this.state.followers.length > 0 &&
                    <ul>
                        {this.state.followers.map((m, key) =>
                            <li key={key}>{m.username}</li>
                        )}
                    </ul>
                }
                <h6>Favorites:</h6>
                {this.state.favorites.length > 0 &&
                    <div>
                        {this.state.favorites.map((title, key) =>
                            <div key={key} className="form-control">
                                <Link to={`/details/${this.state.favIdMap[title]}`}>{title}</Link>
                            </div>)}
                    </div>
                }
            </div>
        )
    }

    // Send the query to omdb API, load into list of favorites
    // Function based on Jose Annunziato's lecture slides
    loadTitleFromAPI = (id, key) => {
        var url = 'https://www.omdbapi.com';
        // My personal API key, do not duplicate or reuse without permission
        url += '?apikey=abfe6d09';
        url += '&i=' + id;
        fetch(url)
        .then(res => res.json())
        .then(json => {
            var newMap = this.state.favIdMap;
            newMap[json.Title] = id;
            this.setState({
                favorites: [...this.state.favorites, json.Title].sort(),
                favIdMap: newMap
            });
        });
    }

    // If logged in, allow follow and add to list. Otherwise, prevent follow
    doFollow = () => {
        // Block follow if not logged in
        if (this.state.curUser === null) {
            alert('Please login before trying to follow users.');
            return;
        }
        // If not already following (backend handles duplicates)
        service.addFollow(this.state.pageId, localStorage.getItem('curUser'));
        service.addFollower(localStorage.getItem('curUser'), this.state.pageId);
        var newFollowing = [...this.state.following, this.state.pageId];
        this.setState({following: newFollowing});
    }

    render() {
        var ownPage = this.state.curUser === this.state.pageId;
        if (this.state.logoutClick) {
            this.setState({logoutClick: false});
            return <Redirect to='/home'/>
        }

        return (
            <div>
                {this.state.curUser === null && this.state.pageId === null &&
                    <span>Please login to view your profile.</span>
                }
                {this.state.pageId !== null &&
                    <div>
                        {ownPage && <h3>Your Profile</h3>}
                        {!ownPage && <h3>{this.state.username}'s Profile</h3>}
                        {ownPage && this.renderMyPage()}
                        {!ownPage && this.renderOtherPage()}
                        <button className="btn btn-danger"
                                onClick={() => {
                                    this.setState({logoutClick: true})
                                    this.props.logout()}}>
                            Logout
                        </button>
                        {!ownPage &&
                            <button className="btn btn-warning"
                                    onClick={() => this.doFollow()}>
                                Follow
                            </button>
                        }
                    </div>
                }
            </div>
        );
    }
}
