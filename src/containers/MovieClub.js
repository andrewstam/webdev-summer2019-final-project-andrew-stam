// Created by Andrew Stam
import React from 'react';
import '../../node_modules/bootstrap/dist/css/bootstrap.css';

export default class MovieClub extends React.Component {
    constructor(props) {
        super(props);
        const pathname = window.location.pathname;
        const paths = pathname.split('/');
        const pageName = paths[2];

        // Pages: /home, /login, /search, /details/{did}, /profile/{uid}
        this.state = {
            page: pageName
        };
    }

    render() {
        return (
            <div>Movie Club</div>
        );
    }
}
