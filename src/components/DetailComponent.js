// Created by Andrew Stam
import React from 'react';
import {Link} from 'react-router-dom';
import UserService from '../services/UserService';
import './DetailComponent.css';
const service = UserService.getInstance();

export default class DetailComponent extends React.Component {
    constructor(props) {
        super(props);

        const pathname = window.location.pathname;
        const paths = pathname.split('/');
        const detailId = paths[2];

        this.state = {
            did: detailId,
            loggedIn: localStorage.getItem('curUser') !== null,
            inFavorites: false,
            stars: "1",
            reviewText: '',
            showReview: false,
            userIdToReviewMap: {},
            userIdToUsernameMap: {},
            showWatchDetails: false,
            date: '',
            group: null,
            groupIdToNameMap: {}
        };

        this.props.setPage('details');
    }

    // Load details about the item with the given ID
    componentDidMount = () => {
        var url = 'https://www.omdbapi.com';
        // My personal API key, do not duplicate or reuse without permission
        url += '?apikey=abfe6d09';
        url += '&i=' + this.state.did;
        fetch(url)
        .then(res => res.json())
        .then(json => {this.setState({
            title: json.Title,
            img: json.Poster,
            year: json.Year,
            release: json.Released,
            rating: json.Rated,
            runtime: json.Runtime,
            genres: json.Genre,
            plot: json.Plot,
            director: json.Director,
            reviews: json.Ratings
        })});
        if (this.state.loggedIn) {
            var cur = localStorage.getItem('curUser');
            service.findFavorites(cur, this.checkIfFavorite);
            service.findStarsForMovie(cur, this.state.did, this.loadStars);
            service.findReviewForMovie(cur, this.state.did, this.loadReview);
            service.findUserGroups(cur, this.loadGroupIds);
        }
        // Load reviews regardless if logged in
        service.findAllReviews(this.state.did, this.loadAllReviews);
    }

    // Load's the logged in user's groups, only used if Leader role
    loadGroupIds = json => {
        for (var idx in json) {
            var id = json[idx];
            service.findGroupById(id, this.loadGroup);
        }
    }

    // Load each group's info
    loadGroup = json => {
        var map = this.state.groupIdToNameMap;
        map[json.groupId] = json.name;
        // Set default group
        this.setState({groupIdToNameMap: map, group: map[json.groupId]});
    }

    // See if this movie is already in the current user's favorites list
    checkIfFavorite = json => {
        // Build new array: data looks like ['1,0,tt0335266', '1,1,tt1856191']
        var arr = json;
        for (var i = 0; i < json.length; i++) {
            var tempArr = json[i].split(',');
            arr[i] = tempArr[1];
            // arr[i] now contains the ID
            if (json[i] === this.state.did) {
                this.setState({inFavorites: true});
                return;
            }
        }
        // Not in favorites list already
        this.setState({inFavorites: false});
    }

    // Get the star rating this user gave this movie
    loadStars = val => {
        this.setState({stars: val});
    }

    // Load the logged in user's review text
    loadReview = text => {
        this.setState({reviewText: text});
    }

    // Load all reviews from backend
    loadAllReviews = json => {
        for (let idx in json) {
            // First 2 tokens are review ID and movie id -> ignore
            // Last token is userId, one before is star rating, rest is review text
            var tokens = json[idx].split(',');
            var obj = {
                // If text had commas, rejoin the tokens and put the commas back
                text: tokens.slice(2, tokens.length - 2).join(','),
                star: tokens[tokens.length - 2],
                userId: tokens[tokens.length - 1]
            };
            var map = this.state.userIdToReviewMap;
            map[obj.userId] = obj;
            this.setState({userIdToReviewMap: map});
            service.findUserById(obj.userId, this.loadUsers);
        }
    }

    // Load users into state who have written a review for this movie
    loadUsers = json => {
        var map = this.state.userIdToUsernameMap;
        map[json.id] = json.username;
        this.setState({userIdToUsernameMap: map});
    }

    // Change state to inFavorites true, send to backend
    doAddFavorite = id => {
        this.setState({inFavorites: true});
        this.props.addFavorite(id);
    }

    // Change state to inFavorites false, send to backend
    doRemoveFavorite = id => {
        this.setState({inFavorites: false});
        this.props.removeFavorite(id);
    }

    // Update state
    doTextChange = text => {
        this.setState({reviewText: text});
    }

    // Update state
    doStarChange = star => {
        this.setState({stars: star});
    }

    // Translate star value into font-awesome icons
    renderAsStars = num => {
        var fullStar = <i className="fa fa-star"/>;
        var emptyStar = <i className="fa fa-star-o"/>;
        switch (num) {
            default:
                return <span>none</span>
            case 1:
                return <div className="wbdv-star">{fullStar} {emptyStar} {emptyStar} {emptyStar} {emptyStar}</div>
            case 2:
                return <div className="wbdv-star">{fullStar} {fullStar} {emptyStar} {emptyStar} {emptyStar}</div>
            case 3:
                return <div className="wbdv-star">{fullStar} {fullStar} {fullStar} {emptyStar} {emptyStar}</div>
            case 4:
                return <div className="wbdv-star">{fullStar} {fullStar} {fullStar} {fullStar} {emptyStar}</div>
            case 5:
                return <div className="wbdv-star">{fullStar} {fullStar} {fullStar} {fullStar} {fullStar}</div>
        }
    }

    // Delete from backend, hide edit review section, and refresh page
    doDeleteReview = () => {
        var cur = localStorage.getItem('curUser');
        service.deleteReview(cur, this.state.did);
        this.setState({showReview: false});
        service.findAllReviews(this.state.did, this.loadAllReviews);
        if (this.state.loggedIn) {
            service.findReviewForMovie(cur, this.state.did, this.loadReview);
        }
    }

    // Send to backend, refresh page
    doSaveReview = () => {
        var cur = localStorage.getItem('curUser');
        this.setState({showReview: false});
        if (this.state.loggedIn) {
            service.createReview(cur, this.state.did, parseInt(this.state.stars), this.state.reviewText, this.loadReview);
            service.editStarsForMovie(cur, this.state.did, parseInt(this.state.stars));
            service.editReviewForMovie(cur, this.state.did, this.state.reviewText);
        }
        service.findAllReviews(this.state.did, this.loadAllReviews);
    }

    // Update backend and rerender
    saveWatchItem = () => {
        this.setState({showWatchDetails: false});
        service.addWatchItem(this.state.group, this.state.did, this.state.date);
    }

    render() {
        var btnText = this.state.reviewText !== '' ? 'Edit Review' : 'Add Review';
        var leader = this.props.userObj ? this.props.userObj.role === 'GroupLeader' : false;

        return (
            <div className="wbdv-detail col-sm-10">
                <div className="wbdv-movie-info">
                    <h2 className="wbdv-detail-header">{this.state.title}</h2>
                    <h4>Released: {this.state.release}</h4>
                    <h5>Rated {this.state.rating}</h5>
                    <h5>Length: {this.state.runtime}</h5>
                    <h6>Directed by {this.state.director}</h6>
                    <h6>Genres include {this.state.genres}</h6>
                    <p>{this.state.plot}</p>
                    Ratings:
                    <ul>
                        {this.state.reviews && this.state.reviews.map((r, key) =>
                            <li key={key}>{r.Source} gave this movie {r.Value}</li>
                        )}
                    </ul>
                </div>
                <img className="img-fluid img-thumbnail rounded float-right wbdv-poster"
                     src={this.state.img} alt={this.state.title}/>
                {this.state.loggedIn && !this.state.inFavorites && !leader &&
                    <button className="btn btn-success wbdv-btn-shadow wbdv-btn-spacing"
                            onClick={() => this.doAddFavorite(this.state.did)}>Add Favorite</button>
                }
                {this.state.loggedIn && this.state.inFavorites && !leader &&
                    <button className="btn btn-danger wbdv-btn-shadow wbdv-btn-spacing"
                            onClick={() => this.doRemoveFavorite(this.state.did)}>Remove Favorite</button>
                }
                {this.state.loggedIn && leader &&
                    <div>
                        {!this.state.showWatchDetails &&
                            <button className="btn btn-success wbdv-btn-shadow wbdv-btn-spacing"
                                    onClick={() => this.setState({showWatchDetails: true})}>Add Watch Item</button>
                        }
                        {this.state.showWatchDetails &&
                            <div>
                                <button className="btn btn-danger wbdv-btn-shadow wbdv-btn-spacing"
                                        onClick={() => this.setState({showWatchDetails: false})}>Cancel</button>
                                <div className="wbdv-movie-info">
                                    <label htmlFor="datef">Watch Date</label>
                                    <input id="datef" value={this.state.date} type="date" className="form-control"
                                           onChange={e => this.setState({date: e.target.value})}/>
                                    {this.state.groupIdToNameMap &&
                                        <div>
                                            <label htmlFor="groupf">Group</label>
                                            <select className="form-control" id="groupf"
                                                    onChange={e => this.setState({group: e.target.value})}
                                                    value={this.state.group}>
                                                {Object.keys(this.state.groupIdToNameMap).map(id =>
                                                    <option value={id} key={id}>{this.state.groupIdToNameMap[id]}</option>
                                                )}
                                            </select>
                                            <button className="btn btn-success btn-block wbdv-btn-shadow wbdv-save-btn"
                                                    onClick={() => this.saveWatchItem()}>Save</button>
                                        </div>
                                    }
                                </div>
                            </div>
                        }
                    </div>
                }
                {this.state.userIdToReviewMap &&
                    <div className="wbdv-movie-info">
                        <h4>Reviews</h4>
                        {Object.keys(this.state.userIdToReviewMap).length === 0 &&
                            <h6><i>No reviews yet.</i></h6>
                        }
                        {Object.keys(this.state.userIdToReviewMap).map(id =>
                            <div className="row" key={id}>
                                <div className="col-sm-1">
                                    <Link to={`/profile/${id}`} onClick={() => this.props.setPage('profile')}
                                          className="wbdv-username">
                                        <b>{this.state.userIdToUsernameMap[id]}</b>
                                    </Link>
                                    :
                                </div>
                                <div className="col-sm-8">
                                    {this.renderAsStars(parseInt(this.state.userIdToReviewMap[id].star))}
                                    {this.state.userIdToReviewMap[id].text}
                                </div>
                                <hr className="wbdv-separator"/>
                            </div>
                        )}
                    </div>
                }
                {this.state.loggedIn && !this.state.showReview && !leader &&
                    <div>
                        <button className="btn btn-info wbdv-btn-shadow wbdv-btn-spacing"
                                onClick={() => this.setState({showReview: true})}>{btnText}</button>
                    </div>
                }
                {this.state.loggedIn && this.state.showReview && !leader &&
                    <div>
                        <button className="btn btn-success wbdv-btn-shadow wbdv-btn-spacing"
                                onClick={() => this.doSaveReview()}>Save Review</button>
                        <button className="btn btn-danger wbdv-delete-btn wbdv-btn-shadow wbdv-btn-spacing"
                                onClick={() => this.doDeleteReview()}>
                            Delete Review
                        </button>
                        <div className="wbdv-movie-info">
                            <label htmlFor="starf">Your Rating</label>
                            <select className="form-control" id="starf"
                                   onChange={e => this.doStarChange(e.target.value)}
                                   value={this.state.stars}>
                                <option value="1">1 star</option>
                                <option value="2">2 stars</option>
                                <option value="3">3 stars</option>
                                <option value="4">4 stars</option>
                                <option value="5">5 stars</option>
                            </select>
                            <label htmlFor="rtext">Review</label>
                            <textarea type="text" className="form-control" id="rtext"
                                   onChange={e => this.doTextChange(e.target.value)}
                                   value={this.state.reviewText}/>
                        </div>
                    </div>
                }
            </div>
        );
    }
}
