// Created by Andrew Stam
import React from 'react';
import {Redirect, Link} from 'react-router-dom';
import './ProfileComponent.css';
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
            service.findStarAverage(id, this.loadStars);
            service.findReviewedMovies(id, this.loadReviews);
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
            favIdMap: {},
            stars: 0.0,
            showFollowBtn: true,
            reviews: [],
            revIdMap: {},
            ownPage: parseInt(id) === parseInt(localStorage.getItem('curUser'))
        };

        this.props.setPage('profile');
    }

    componentWillReceiveProps(props) {
        if (this.props !== props) {
            this.props = props;
        }
    }

    // Change which user profile page is shown
    changePage = id => {
        this.setState({
            pageId: id,
            followers: [],
            following: [],
            favorites: [],
            favIdMap: {},
            reviews: [],
            revIdMap: {},
            ownPage: parseInt(id) === parseInt(localStorage.getItem('curUser'))
        });
        // profile to load
        if (id !== null) {
            service.findUserById(id, this.loadUserData);
            service.findFollowers(id, this.followersCallback);
            service.findFollowing(id, this.followingCallback);
            service.findFavorites(id, this.favoritesCallback);
            service.findStarAverage(id, this.loadStars);
            service.findReviewedMovies(id, this.loadReviews);
        }
    }

    // Display reviews
    loadReviews = json => {
        for (let idx in json) {
            this.loadTitleFromAPI(json[idx], false);
        }
    }

    // Once found user from backend, update page
    loadUserData = json => {
        // Public data
        this.setState({
            username: json.username,
            firstname: json.firstname,
            lastname: json.lastname,
            role: json.role,
            ownPage: parseInt(this.state.pageId) === parseInt(this.state.curUser)
        });
        // Private data (only can see if own profile)
        if (parseInt(this.state.pageId) === parseInt(this.state.curUser)) {
            this.setState({
                dob: json.dob,
                email: json.email
            });
        }
    }

    // Set state to given followers after backend load
    followersCallback = json => {
        this.setState({followers: json});
        // Now know if a follower, so update button rendering
        this.setState({showFollowBtn: !this.isFollower(json)});
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
            this.loadTitleFromAPI(arr[i], true);
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
        // Update home page
        this.props.setUser(user);
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
        return (<div className="row">
            <div className="wbdv-profile-detail col-sm-8">
                <label htmlFor="fname">First name</label>
                <input type="text" className="form-control" id="fname"
                       onChange={e => this.changeFirstName(e.target.value)}
                       value={this.state.firstname}/>
                <label htmlFor="lname">Last name</label>
                <input type="text" className="form-control" id="lname"
                       onChange={e => this.changeLastName(e.target.value)}
                       value={this.state.lastname}/>
                <label htmlFor="emailf">Email</label>
                <input type="email" className="form-control" id="emailf"
                       onChange={e => this.changeEmail(e.target.value)}
                       value={this.state.email}/>
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
                       value={this.state.dob}/>
            </div>
            {this.renderLinks()}
        </div>)
    }

    // Disable input fields, hide private info
    renderOtherPage = () => {
        return (<div className="row">
            <div className="wbdv-profile-detail col-sm-8">
                <label htmlFor="fname">First name</label>
                <input type="text" className="form-control wbdv-disabled" id="fname" disabled
                       onChange={e => this.changeFirstName(e.target.value)}
                       value={this.state.firstname}/>
                <label htmlFor="lname">Last name</label>
                <input type="text" className="form-control wbdv-disabled" id="lname" disabled
                       onChange={e => this.changeLastName(e.target.value)}
                       value={this.state.lastname}/>
                <label htmlFor="rolef">Role</label>
                <select className="form-control wbdv-disabled" id="rolef" disabled
                       onChange={e => this.changeRole(e.target.value)}
                       value={this.state.role}>
                    <option value="GroupMember">Group Member</option>
                    <option value="GroupLeader">Group Leader</option>
                </select>
            </div>
            {this.renderLinks()}
        </div>)
    }

    // Load user's average rating, one decimal place
    loadStars = json =>
        this.setState({stars: json.toFixed(1)})

    // Renders following list, followers list, and favorites list, all as links, in addition to average rating
    renderLinks = () => {
        return (
            <div className="col-sm wbdv-profile-detail">
                <h6>Following:</h6>
                {this.state.following.length > 0 &&
                    <ul>
                        {this.state.following.map((m, key) => <li key={key} className="wbdv-profile-list-item wbdv-related-user">
                            <Link to={`/profile/${m.id}`} className="wbdv-related-link"
                                  onClick={() => this.changePage(m.id)}>{m.username}</Link>
                        </li>)}
                    </ul>
                }
                <h6>Followers:</h6>
                {this.state.followers.length > 0 &&
                    <ul>
                        {this.state.followers.map((m, key) =>
                            <li key={key} className="wbdv-profile-list-item wbdv-related-user">
                                <Link to={`/profile/${m.id}`} className="wbdv-related-link"
                                      onClick={() => this.changePage(m.id)}>{m.username}</Link>
                            </li>
                        )}
                    </ul>
                }
                {this.state.stars > 0 &&
                    <h6 className="wbdv-star-text">Average Star Rating: {this.state.stars}</h6>
                }
                {this.state.stars <= 0 &&
                    <h6 className="wbdv-star-text"><i>No movie ratings yet.</i></h6>
                }
                <h6>Favorites:</h6>
                {this.state.favorites.length > 0 &&
                    <div>
                        {this.state.favorites.map((title, key) =>
                            <div key={key} className="form-control wbdv-favorite">
                                <Link to={`/details/${this.state.favIdMap[title]}`} onClick={() => this.props.setPage('details')}
                                      className="wbdv-related-link">{title}</Link>
                                <i className="fa fa-times float-right wbdv-delete-fav"
                                   onClick={() => this.doDeleteFavorite(title, this.state.favIdMap[title])}></i>
                            </div>)}
                    </div>
                }
                <h6>Reviews:</h6>
                {this.renderReviews()}
            </div>
        )
    }

    // Remove favorite from database, also rerender page
    doDeleteFavorite = (title, id) => {
        var mapCopy = this.state.favIdMap;
        var favCopy = this.state.favorites;
        delete mapCopy[title];
        // Remove from favorites array
        for (let idx in favCopy) {
            if (favCopy[idx] === title) {
                favCopy.splice(idx, 1);
                break;
            }
        }
        this.props.removeFavorite(id);
        // Remove from map to rerender page
        this.setState({favIdMap: mapCopy, favorites: favCopy});
    }

    // Send the query to omdb API, load into list of favorites
    // Function based on Jose Annunziato's lecture slides
    loadTitleFromAPI = (id, forFavs) => {
        var url = 'https://www.omdbapi.com';
        // My personal API key, do not duplicate or reuse without permission
        url += '?apikey=abfe6d09';
        url += '&i=' + id;
        fetch(url)
        .then(res => res.json())
        .then(json => {
            if (forFavs) {
                // For favorites
                var newMap = this.state.favIdMap;
                newMap[json.Title] = id;
                this.setState({
                    favorites: [...this.state.favorites, json.Title].sort(),
                    favIdMap: newMap
                });
            } else {
                // For reviews
                var revMap = this.state.revIdMap;
                revMap[json.Title] = id;
                this.setState({
                    reviews: [...this.state.reviews, json.Title].sort(),
                    revIdMap: revMap
                });
            }
        });
    }

    // Show up to 3 reviews, if more, link to reviews page
    renderReviews = () => {
        var first3;
        var showLink = false;
        if (this.state.reviews.length > 3) {
            first3 = this.state.reviews.sort().slice(0, 3);
            showLink = true;
        } else {
            first3 = this.state.reviews.sort();
        }
        return (<div>
            {first3.map((title, key) =>
                <div key={key} className="form-control wbdv-favorite">
                    <Link to={`/details/${this.state.revIdMap[title]}`} onClick={() => this.props.setPage('details')}
                          className="wbdv-related-link">{title}</Link>
                </div>)}
            {showLink &&
                <Link to={`/reviews/${this.state.pageId}`} onClick={() => this.props.setPage('reviews')}
                      className="wbdv-related-link">See more...</Link>
            }
        </div>)
    }

    // If logged in, allow follow and add to list. Otherwise, prevent follow
    doFollow = () => {
        // Block follow if not logged in
        if (this.state.curUser === null) {
            alert('Please login before trying to follow users.');
            return;
        }
        // If not already following (backend handles duplicates)
        service.addFollow(this.state.pageId, this.state.curUser);
        service.addFollower(this.state.curUser, this.state.pageId);
        // Logged in user clicked to follow the other user, so update other user's followers
        var newFollowers = [...this.state.followers, this.props.userObj];
        this.setState({followers: newFollowers, showFollowBtn: false});
    }

    // If logged in, allow unfollow and remove from list. Otherwise, prevent unfollow
    doUnfollow = () => {
        // Block follow if not logged in (should never reach here, but here just in case)
        if (this.state.curUser === null) {
            alert('Please login before trying to unfollow users.');
            return;
        }
        // Remove data pair in database
        service.removeFollow(this.state.pageId, this.state.curUser);
        service.removeFollower(this.state.curUser, this.state.pageId);
        // Logged in user clicked to unfollow the other user, so update other user's followers
        var followersCopy = this.state.followers;
        // Remove from logged in user from followers array
        for (let idx in followersCopy) {
            if (followersCopy[idx].id === parseInt(this.state.curUser)) {
                followersCopy.splice(idx, 1);
                break;
            }
        }
        // Rerender
        this.setState({followers: followersCopy, showFollowBtn: true});
    }

    // Check if the user's profile's followers list contains the logged in user
    isFollower = list => {
        var is = false;
        list.forEach(f => {
            if (f.id === parseInt(this.state.curUser)) {
                is = true;
            }
        });
        return is;
    }

    render() {
        if (this.state.logoutClick) {
            return <Redirect to='/login'/>
        }

        return (
            <div>
                {this.state.curUser === null && this.state.pageId === null &&
                    <span className="wbdv-profile-detail">Please login to view your profile.</span>
                }
                {this.state.pageId !== null &&
                    <div>
                        {this.state.ownPage && <h3 className="wbdv-profile-detail">Your Profile</h3>}
                        {!this.state.ownPage && <h3 className="wbdv-profile-detail">{this.state.username}'s Profile</h3>}
                        <div className="container">
                            {this.state.ownPage && this.renderMyPage()}
                            {!this.state.ownPage && this.renderOtherPage()}
                        </div>
                        {this.state.ownPage &&
                            <button className="btn btn-danger wbdv-btn-shadow"
                                    onClick={() => {
                                        this.props.logout();
                                        this.setState({logoutClick: true})}}>
                                Logout
                            </button>
                        }
                        {!this.state.ownPage && this.state.showFollowBtn &&
                            <button className="btn btn-warning wbdv-btn-shadow"
                                    onClick={() => this.doFollow()}>
                                Follow
                            </button>
                        }
                        {!this.state.ownPage && !this.state.showFollowBtn &&
                            <button className="btn btn-secondary wbdv-btn-shadow"
                                    onClick={() => this.doUnfollow()}>
                                Unfollow
                            </button>
                        }
                    </div>
                }
            </div>
        );
    }
}
