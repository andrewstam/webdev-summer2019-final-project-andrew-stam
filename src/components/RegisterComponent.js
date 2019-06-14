// Created by Andrew Stam
import React from 'react';
import {Redirect} from 'react-router-dom';
import UserService from '../services/UserService';
const service = UserService.getInstance();

export default class RegisterComponent extends React.Component {
    constructor(props) {
        super(props);

        // Default role is GroupMember
        this.state = {
            username: '',
            password: '',
            cPassword: ' ',
            role: 'GroupMember',
            loggedIn: this.props.user !== null,
            mismatch: false
        };
    }

    // Set as logged in
    registerCallback = json => {
        console.log('json: ' + JSON.stringify(json));
        if (json.id !== null) {
            this.setState({loggedIn: true});
            // Send user info to parent
            this.props.setUser(json);
        } else {
            // Tell user the info was wrong
            this.setState({failed: true});
        }
    }

    // Check if valid credentials, if so then show profile on front-end
    doValidate = () => {
        // Check if passwords match
        if (this.state.password !== this.state.cPassword) {
            this.setState({mismatch: true});
            return;
        } else {
            this.setState({mismatch: false});
        }
        // Send to backend to validate
        var id = (new Date()).getTime().toString();
        service.createUser(id, this.state.username, this.state.password, this.registerCallback);
    }

    render() {
        // Load user profile page once logged in
        if (this.state.loggedIn) {
            return <Redirect to='/profile'/>
        }

        return (
            <div>
                <h3>Register Page</h3>
                <div>
                    <input type="text" className="form-control"
                           onChange={e => this.setState({username: e.target.value})}
                           placeholder="Username"/>
                    <input type="text" className="form-control"
                           onChange={e => this.setState({password: e.target.value})}
                           placeholder="Password"/>
                    <input type="text" className="form-control"
                           onChange={e => this.setState({cPassword: e.target.value})}
                           placeholder="Confirm Password"/>
                    <div>
                        <button className="btn btn-success" type="submit"
                                onClick={() => this.doValidate()}>
                            Register
                        </button>
                    </div>
                </div>
                {this.state.mismatch &&
                    <h6>Passwords do not match. Try again.</h6>
                }
            </div>
        );
    }
}
