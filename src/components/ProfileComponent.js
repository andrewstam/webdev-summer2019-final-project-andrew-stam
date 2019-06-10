// Created by Andrew Stam
import React from 'react';

export default class ProfileComponent extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            username: ''
        };
    }

    render() {
        return (
            <div>
                <h3>Profile</h3>
            </div>
        );
    }
}
