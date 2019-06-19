// Created by Andrew Stam
import React from 'react';
import UserService from '../services/UserService';
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
            stars: "1", // todo load from DB
            reviewText: ''
        };
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
        }
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
    loadStars = json => {
        this.setState({stars: json});
        console.log(json)
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

    render() {
        return (
            <div>
                <img className="img-fluid img-thumbnail rounded float-right"
                     src={this.state.img} alt={this.state.title}/>
                <h2>{this.state.title}</h2>
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
                {this.state.loggedIn && !this.state.inFavorites &&
                    <button className="btn btn-success"
                            onClick={() => this.doAddFavorite(this.state.did)}>Add Favorite</button>
                }
                {this.state.loggedIn && this.state.inFavorites &&
                    <button className="btn btn-danger"
                            onClick={() => this.doRemoveFavorite(this.state.did)}>Remove Favorite</button>
                }
                {this.state.loggedIn &&
                    <div className="col-sm-8">
                        <label htmlFor="starf">Your Rating</label>
                        <select className="form-control" id="starf"
                               onChange={e => this.setState({stars: e.target.value})}
                               value={this.state.stars}>
                            <option value="1">1 star</option>
                            <option value="2">2 stars</option>
                            <option value="3">3 stars</option>
                            <option value="4">4 stars</option>
                            <option value="5">5 stars</option>
                        </select>
                        <label htmlFor="rtext">Review</label>
                        <textarea type="text" className="form-control" id="rtext"
                               onChange={e => this.setState({reviewText: e.target.value})}
                               value={this.state.reviewText}/>
                    </div>
                }
            </div>
        );
    }
}
