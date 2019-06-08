// Created by Andrew Stam
import React from 'react';
import './SearchComponent.css';
import ResultItem from './ResultItem';

// Handles search queries to the omdb API
export default class SearchComponent extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            query: '',
            results: []
        };
    }

    // Send the query to omdb API, load result into state
    // Function based on Jose Annunziato's lecture slides
    submitQuery = () => {
        var url = 'http://www.omdbapi.com';
        // My personal API key, do not duplicate or reuse without permission
        url += '?apikey=abfe6d09';
        url += '&s=' + this.state.query;
        fetch(url)
        .then(res => res.json())
        .then(json => {this.setState({results: json.Search})});
    }

    render() {
        return (
            <div>
                <h3>Search Page</h3>
                <div className="input-group wbdv-search-bar">
                    <input type="text" className="form-control" value={this.state.query}
                           onChange={e => this.setState({query: e.target.value})}
                           placeholder="Search for a movie"/>
                    <div className="input-group-append">
                        <button className="btn btn-success" type="submit"
                                onClick={() => this.submitQuery()}>Search</button>
                    </div>
                </div>
                {this.state.results.length > 0 &&
                    <div>
                        <h4>Results</h4>
                        {this.state.results.map((r, key) =>
                            <ResultItem key={key} title={r.Title} did={r.imdbID}/>
                        )}
                    </div>
                }
            </div>
        );
    }
}
