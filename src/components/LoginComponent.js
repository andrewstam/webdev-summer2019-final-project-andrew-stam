// Created by Andrew Stam
import React from 'react';
import UserService from '../services/UserService';
const service = UserService.getInstance();

export default class LoginComponent extends React.Component {
    constructor(props) {
        super(props);

        // Default role is GroupMember
        this.state = {
            username: '',
            password: '',
            role: 'GroupMember'
        };
    }

    render() {
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
                                onClick={() => service.validateLogin((new Date()).getTime().toString(),
                                    this.state.username, this.state.password, this.state.role)}>
                            Login
                        </button>
                    </div>
                </div>
            </div>
        );
    }
}
