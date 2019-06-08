// Created by Andrew Stam
import React from 'react';

export default class DetailComponent extends React.Component {
    constructor(props) {
        super(props);

        const pathname = window.location.pathname;
        const paths = pathname.split('/');
        const detailId = paths[2];

        this.state = {
            did: detailId
        };
    }

    // Load details about the item with the given ID
    componentDidMount = () => {
        var url = 'http://www.omdbapi.com';
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
            </div>
        );
    }
}
