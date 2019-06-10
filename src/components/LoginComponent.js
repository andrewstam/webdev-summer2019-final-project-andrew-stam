// Created by Andrew Stam
import React from 'react';

export default class LoginComponent extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            username: '',
            password: ''
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
                                onClick={() => alert('click')}>Login</button>
                    </div>
                </div>
            </div>
        );
    }
}
