// Created by Andrew Stam
import React from 'react';
import {Redirect, Link} from 'react-router-dom';
import './LoginComponent.css';
import UserService from '../services/UserService';
const service = UserService.getInstance();

export default class LoginComponent extends React.Component {
    constructor(props) {
        super(props);

        // Default role is GroupMember
        this.state = {
            username: '',
            password: '',
            role: 'GroupMember',
            loggedIn: localStorage.getItem('curUser') !== null,
            failed: false
        };

        this.props.setPage('login');
    }

    componentWillReceiveProps(props) {
        if (this.props !== props) {
            this.props = props;
        }
    }

    // After the server response, set state to loggedIn if valid
    loginCallback = json => {
        if (json.id !== null) {
            // Send user info to parent
            this.props.setUser(json);
            this.setState({loggedIn: true});
        } else {
            // Tell user the info was wrong
            this.setState({loggedIn: false, failed: true});
        }
    }

    // Check if valid login, if so then show profile on front-end
    doValidate = () => {
        // Send to backend to validate
        service.validateLogin(this.state.username, this.state.password, this.loginCallback);
    }

    render() {
        // Load user profile page once logged in
        if (this.state.loggedIn) {
            return <Redirect to='/profile'/>
        }

        return (
            <div className="wbdv-login-container">
                <h3>Login Page</h3>
                <div>
                    <label htmlFor="user">Username</label>
                    <input type="text" className="form-control wbdv-login-item" id="user"
                           onChange={e => this.setState({username: e.target.value})}
                           placeholder="Username"/>
                    <label htmlFor="pass">Password</label>
                    <input type="password" className="form-control wbdv-login-item" id="pass"
                           onChange={e => this.setState({password: e.target.value})}
                           placeholder="Password"/>
                    <div>
                        <button className="btn btn-success btn-block wbdv-login-btn" type="submit"
                                onClick={() => this.doValidate()}>
                            Login
                        </button>
                    </div>
                    <Link to="/register" className="wbdv-register-link">New user? Register here</Link>
                </div>
                {this.state.failed &&
                    <h6>Login failed. Try again.</h6>
                }
            </div>
        );
    }
}
