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

    // Check if valid login, if so then show profile on front-end
    doValidate = () => {
        // Send to backend to validate
        // for new IDs, use (new Date()).getTime().toString()
        const valid = service.validateLogin(this.state.username, this.state.password);
        console.log(valid);
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
                                onClick={() => this.doValidate()}>
                            Login
                        </button>
                    </div>
                </div>
            </div>
        );
    }
}
