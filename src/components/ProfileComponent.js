// Created by Andrew Stam
import React from 'react';

export default class ProfileComponent extends React.Component {
    constructor(props) {
        super(props);

        const pathname = window.location.pathname;
        const paths = pathname.split('/');
        // If there's an ID, load that user. Otherwise, no ID so load logged in user's info
        const id = paths.length > 2 ? paths[2] : 'own';

        this.state = {
            username: '',
            uid: id
        };
    }

    render() {
        return (
            <div>
                <h3>Profile {this.state.uid}</h3>
            </div>
        );
    }
}
