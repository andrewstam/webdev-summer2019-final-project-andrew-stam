// Created by Andrew Stam
import React from 'react';
import '../../node_modules/bootstrap/dist/css/bootstrap.css';
import {BrowserRouter as Router, Link, Route} from 'react-router-dom';
import SearchComponent from '../components/SearchComponent';

export default class MovieClub extends React.Component {
    constructor(props) {
        super(props);
        const pathname = window.location.pathname;
        const paths = pathname.split('/');
        const pageName = paths[1];

        // Pages: /home, /login, /search, /details/{did}, /profile/{uid}
        this.state = {
            page: pageName
        };
    }

    render() {
        return (
            <div className="container-fluid">
                <h1>Movie Club</h1>
                <Router>
                    <Link to="/search">Search</Link>
                    <Route path="/(|search)"
                           component={SearchComponent}/>
                </Router>
            </div>
        );
    }
}
