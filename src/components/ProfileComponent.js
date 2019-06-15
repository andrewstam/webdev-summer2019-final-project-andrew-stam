// Created by Andrew Stam
import React from 'react';
import {Redirect} from 'react-router-dom';

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

    componentWillReceiveProps(props) {
        if (this.props !== props) {
            this.props = props;
        }
    }

    render() {
        // If logged out, load login
        if (this.props.userId === null) {
            return <Redirect to='/login'/>
        }

        return (
            <div>
                <h3>Profile {this.state.uid} {this.props.userId}</h3>
                {this.props.userId === null &&
                    <span>Please login</span>
                }
                {this.props.userId !== null &&
                    <button className="btn btn-danger"
                            onClick={() => this.props.logout()}>
                        Logout
                    </button>
                }
            </div>
        );
    }
}
