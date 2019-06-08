// Created by Andrew Stam
import React from 'react';
import './SearchComponent.css';

// Handles search queries to the omdb API
export default class SearchComponent extends React.Component {
    render() {
        return (
            <div>
                <h3>Search Page</h3>
                <div className="input-group wbdv-search-bar">
                    <input type="text" className="form-control"
                           placeholder="Search for anything movie-related!"/>
                    <div className="input-group-append">
                        <button className="btn btn-success">Search</button>
                    </div>
                </div>
            </div>
        );
    }
}
