// Created by Andrew Stam
import React from 'react';
import {Redirect} from 'react-router-dom';
import './RegisterComponent.css';
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
            id: '',
            role: 'GroupMember',
            loggedIn: this.props.user != null,
            mismatch: false,
            badUser: false,
            validUser: true
        };

        this.props.setPage('register');
    }

    componentWillReceiveProps(props) {
        if (this.props !== props) {
            this.props = props;
        }
    }

    // Set as logged in
    registerCallback = success => {
        if (success) {
            this.setState({loggedIn: true});
            var obj = {
                username: this.state.username,
                id: this.state.id,
                role: this.state.role
            };
            // Send user info to parent, newest user is now registered user
            this.props.setUser(obj);
            this.props.loadNewestUser(obj);
        } else {
            // Tell user the username was taken
            this.setState({badUser: true});
        }
    }

    // User chooses their role upon registration
    pickRole = role =>
        this.setState({role: role})

    // Check if valid credentials, if so then show profile on front-end
    doValidate = () => {
        // Reset state
        this.setState({mismatch: false, badUser: false});
        // Check if passwords match
        if (this.state.password !== this.state.cPassword) {
            this.setState({mismatch: true});
            return;
        } else {
            this.setState({mismatch: false});
        }
        // Send to backend to validate
        var id = (new Date()).getTime().toString();
        this.setState({id: id});

        service.createUser(id, this.state.username, this.state.password, this.state.role, this.registerCallback);
    }

    // Make sure username is <= 10 characters and alphanumeric
    validateUsernameFormat = text => {
        if (text.length > 10) {
            this.setState({validUser: false});
        } else if (!(/^[a-z0-9]+$/i.test(text)) && text.length > 0) {
            this.setState({validUser: false});
        } else {
            this.setState({username: text, validUser: true});
        }
    }

    render() {
        // Load home page once logged in
        if (this.state.loggedIn) {
            return <Redirect to='/home'/>
        }

        return (
            <div className="wbdv-register-container">
                <h3>Register Page</h3>
                <div>
                    <label htmlFor="userf">Username</label>
                    <input type="text" className="form-control wbdv-register-item" id="userf"
                           onChange={e => this.validateUsernameFormat(e.target.value)}
                           value={this.state.username}
                           placeholder="Username"/>
                    {!this.state.validUser &&
                        <span className="wbdv-error-text">
                            Username must be 10 characters or less and alphanumeric<br/>
                        </span>
                    }
                    <label htmlFor="passf">Password</label>
                    <input type="password" className="form-control wbdv-register-item" id="passf"
                           onChange={e => this.setState({password: e.target.value})}
                           placeholder="Password"/>
                    <label htmlFor="cpassf">Confirm Password</label>
                    <input type="password" className="form-control wbdv-register-item" id="cpassf"
                           onChange={e => this.setState({cPassword: e.target.value})}
                           placeholder="Confirm Password"/>
                    <label htmlFor="rolef">Role</label>
                    <select className="form-control wbdv-register-item" id="rolef"
                           onChange={e => this.pickRole(e.target.value)}
                           defaultValue="GroupMember">
                        <option value="GroupMember">Group Member</option>
                        <option value="GroupLeader">Group Leader</option>
                    </select>
                    <div className="wbdv-register-btn">
                        <button className="btn btn-success btn-block" type="submit"
                                onClick={() => this.doValidate()}>
                            Register
                        </button>
                    </div>
                </div>
                {this.state.mismatch &&
                    <h6 className="wbdv-error-text">Passwords do not match. Try again.</h6>
                }
                {this.state.badUser &&
                    <h6 className="wbdv-error-text">Username taken. Try again.</h6>
                }
            </div>
        );
    }
}
