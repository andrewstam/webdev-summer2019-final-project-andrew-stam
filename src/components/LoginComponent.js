// Created by Andrew Stam
import React from 'react';
import {Redirect} from 'react-router-dom';
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
            loggedIn: this.props.user !== null,
            failed: false
        };
    }

    // After the server response, set state to loggedIn if valid
    loginCallback = json => {
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

    // Check if valid login, if so then show profile on front-end
    doValidate = () => {
        // Send to backend to validate
        // for new IDs, use (new Date()).getTime().toString()
        service.validateLogin(this.state.username, this.state.password, this.loginCallback);
    }

    render() {
        // Load user profile page once logged in
        if (this.state.loggedIn) {
            return <Redirect to='/profile'/>
        }

        return (
            <div>
                <h3>Login Page</h3>
                <div>
                    <input type="text" className="form-control"
                           onChange={e => this.setState({username: e.target.value})}
                           placeholder="Username"/>
                    <input type="text" className="form-control"
                           onChange={e => this.setState({password: e.target.value})}
                           placeholder="Password"/>
                    <div>
                        <button className="btn btn-success" type="submit"
                                onClick={() => this.doValidate()}>
                            Login
                        </button>
                    </div>
                </div>
                {this.state.failed &&
                    <h6>Login failed. Try again.</h6>
                }
            </div>
        );
    }
}
