// Created by Andrew Stam
import React from 'react';
import {Redirect, Link} from 'react-router-dom';
import './ProfileComponent.css';
import UserService from '../services/UserService';
const service = UserService.getInstance();

export default class ReviewComponent extends React.Component {
    constructor(props) {
        super(props);

        const pathname = window.location.pathname;
        const paths = pathname.split('/');
        // If there's an ID, load that user. Otherwise, no ID so load logged in user's reviews
        var id = paths.length > 2 ? paths[2] : 'own';

        if (id === 'own') {
            // load own reviews
            id = localStorage.getItem('curUser');
        }

        // reviews to load
        if (id !== null) {
            service.findUserById(id, this.loadUserData);
            service.findStarAverage(id, this.loadStars);
            service.findReviewedMovies(id, this.loadReviews);
        }

        this.state = {
            pageId: id,
            curUser: localStorage.getItem('curUser'),
            username: '',
            stars: 0.0,
            reviews: [],
            revIdMap: {},
            ownPage: parseInt(id) === parseInt(localStorage.getItem('curUser'))
        };

        this.props.setPage('reviews');
    }

    // Once found user from backend, update page
    loadUserData = json => {
        // Public data
        this.setState({
            username: json.username,
            ownPage: parseInt(this.state.pageId) === parseInt(this.state.curUser)
        });
    }

    // Load user's average rating, one decimal place
    loadStars = json =>
        this.setState({stars: json.toFixed(1)})

    // Display reviews
    loadReviews = json => {
        for (let idx in json) {
            this.loadTitleFromAPI(json[idx], false);
        }
    }

    // Send the query to omdb API, load into list of favorites
    // Function based on Jose Annunziato's lecture slides
    loadTitleFromAPI = id => {
        var url = 'https://www.omdbapi.com';
        // My personal API key, do not duplicate or reuse without permission
        url += '?apikey=abfe6d09';
        url += '&i=' + id;
        fetch(url)
        .then(res => res.json())
        .then(json => {
            // For reviews
            var revMap = this.state.revIdMap;
            revMap[json.Title] = id;
            this.setState({
                reviews: [...this.state.reviews, json.Title].sort(),
                revIdMap: revMap
            });
        });
    }

    // Show all reviews
    renderReviews = () => {
        return (<div>
            {this.state.reviews.sort().map((title, key) =>
                <div key={key} className="form-control wbdv-favorite">
                    <Link to={`/details/${this.state.revIdMap[title]}`} onClick={() => this.props.setPage('details')}
                          className="wbdv-related-link">{title}</Link>
                </div>)}
        </div>)
    }

    render() {
        return (
            <div>
                <h1>{this.state.username}'s Reviews</h1>
                {this.renderReviews()}
            </div>
        )
    }
}
