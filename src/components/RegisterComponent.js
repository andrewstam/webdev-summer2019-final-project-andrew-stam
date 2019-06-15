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
            id: '',
            role: 'GroupMember',
            loggedIn: this.props.user != null,
            mismatch: false,
            badUser: false
        };

        this.props.setPage('register');
    }

    componentWillReceiveProps(props) {
        if (this.props !== props) {
            this.props = props;
        }
    }

    // Set as logged in
    registerCallback = json => {
        if (json) {
            this.setState({loggedIn: true});
            var obj = {
                username: this.state.username,
                id: this.state.id,
                role: this.state.role,
            };
            // Send user info to parent
            this.props.setUser(obj);
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
                    <label htmlFor="rolef">Role</label>
                    <select className="form-control" id="rolef"
                           onChange={e => this.pickRole(e.target.value)}
                           defaultValue="GroupMember">
                        <option value="GroupMember">Group Member</option>
                        <option value="GroupLeader">Group Leader</option>
                    </select>
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
                {this.state.badUser &&
                    <h6>Username taken. Try again.</h6>
                }
            </div>
        );
    }
}
