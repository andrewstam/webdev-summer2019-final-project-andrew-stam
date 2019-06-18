// Created by Andrew Stam
import React from 'react';
import './SearchComponent.css';
import ResultItem from './ResultItem';

// Handles search queries to the omdb API
export default class SearchComponent extends React.Component {
    constructor(props) {
        super(props);

        const pathname = window.location.pathname;
        const paths = pathname.split('/');

        // Get query from URL if there is one
        var q = this.props.match ? this.props.match.params.criteria : '';

        this.state = {
            query: q,
            results: []
        };
    }

    componentDidMount() {
        // If query is in URL, run query
        if (this.state.query !== '') {
            this.submitQuery();
        }
    }

    // Send the query to omdb API, load result into state
    // Function based on Jose Annunziato's lecture slides
    submitQuery = () => {
        var url = 'https://www.omdbapi.com';
        // My personal API key, do not duplicate or reuse without permission
        url += '?apikey=abfe6d09';
        url += '&s=' + this.state.query;
        this.props.history.push(this.state.query);
        fetch(url)
        .then(res => res.json())
        .then(json => {this.setState({results: json.Search})});
    }

    // User can press enter to submit form too
    checkForEnter = event => {
        if (event.charCode === 13) {
            // User pressed enter, submit form
            this.submitQuery();
        }
    }

    render() {
        return (
            <div>
                <h3>Search Page</h3>
                <div className="input-group wbdv-search-bar">
                    <input type="text" className="form-control" value={this.state.query}
                           onChange={e => this.setState({query: e.target.value})}
                           placeholder="Search for a movie"
                           onKeyPress={this.checkForEnter}/>
                    <div className="input-group-append">
                        <button className="btn btn-success" type="submit"
                                onClick={() => this.submitQuery()}>Search</button>
                    </div>
                </div>
                {this.state.results && this.state.results.length > 0 &&
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
