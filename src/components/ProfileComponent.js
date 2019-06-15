// Created by Andrew Stam
import React from 'react';
import {Redirect} from 'react-router-dom';
import UserService from '../services/UserService';
const service = UserService.getInstance();

export default class ProfileComponent extends React.Component {
    constructor(props) {
        super(props);

        const pathname = window.location.pathname;
        const paths = pathname.split('/');
        // If there's an ID, load that user. Otherwise, no ID so load logged in user's info
        var id = paths.length > 2 ? paths[2] : 'own';

        if (id === 'own') {
            // load own profile
            id = localStorage.getItem('curUser');
        }

        // profile to load
        if (id !== null) {
            service.findUserById(id, this.loadUserData);
        }

        this.state = {
            pageId: id,
            curUser: localStorage.getItem('curUser'),
            id: '',
            username: '',
            password: '',
            firstname: '',
            lastname: '',
            dob: '',
            role: '',
            email: ''
        };
    }

    componentWillReceiveProps(props) {
        if (this.props !== props) {
            this.props = props;
        }
    }

    // Once found user from backend, update page
    loadUserData = json => {
        // Public data
        this.setState({
            username: json.username,
            firstname: json.firstname,
            lastname: json.lastname,
            role: json.role
        });
        // Private data (only can see if own profile)
        if (this.state.pageId === this.state.curUser) {
            this.setState({
                dob: json.dob,
                email: json.email
            });
        }
    }

    // Update the user stored in the backend
    updateBackend = user => {
        service.updateUser(user, this.state.pageId);
    }

    // Change this user's first name
    changeFirstName = name => {
        this.setState({firstname: name});
        var user = {
            id: this.state.pageId,
            username: this.state.username,
            password: this.state.password,
            firstname: name,
            lastname: this.state.lastname,
            dob: this.state.dob,
            role: this.state.role,
            email: this.state.email
        };
        this.updateBackend(user);
    }

    // Change this user's last name
    changeLastName = name => {
        this.setState({lastname: name});
        var user = {
            id: this.state.pageId,
            username: this.state.username,
            password: this.state.password,
            firstname: this.state.firstname,
            lastname: name,
            dob: this.state.dob,
            role: this.state.role,
            email: this.state.email
        };
        this.updateBackend(user);
    }

    // Change this user's role
    changeRole = role => {
        this.setState({role: role});
        var user = {
            id: this.state.pageId,
            username: this.state.username,
            password: this.state.password,
            firstname: this.state.firstname,
            lastname: this.state.lastname,
            dob: this.state.dob,
            role: role,
            email: this.state.email
        };
        this.updateBackend(user);
    }

    // Change this user's email
    changeEmail = email => {
        this.setState({email: email});
        var user = {
            id: this.state.pageId,
            username: this.state.username,
            password: this.state.password,
            firstname: this.state.firstname,
            lastname: this.state.lastname,
            dob: this.state.dob,
            role: this.state.role,
            email: email
        };
        this.updateBackend(user);
    }

    // Change this user's date of birth
    changeDob = dob => {
        this.setState({user: {dob: dob}});
        var user = {
            id: this.state.pageId,
            username: this.state.username,
            password: this.state.password,
            firstname: this.state.firstname,
            lastname: this.state.lastname,
            dob: dob,
            role: this.state.role,
            email: this.state.email
        };
        this.updateBackend(user);
    }

    // Enable input fields, show private info
    renderMyPage = () => {
        return (<div>
            <label htmlFor="fname">First name</label>
            <input type="text" className="form-control" id="fname"
                   onChange={e => this.changeFirstName(e.target.value)}
                   defaultValue={this.state.firstname}/>
            <label htmlFor="lname">Last name</label>
            <input type="text" className="form-control" id="lname"
                   onChange={e => this.changeLastName(e.target.value)}
                   defaultValue={this.state.lastname}/>
            <label htmlFor="emailf">Email</label>
            <input type="email" className="form-control" id="emailf"
                   onChange={e => this.changeEmail(e.target.value)}
                   defaultValue={this.state.email}/>
            <label htmlFor="rolef">Role</label>
            <select className="form-control" id="rolef"
                   onChange={e => this.changeRole(e.target.value)}
                   value={this.state.role}>
                <option value="GroupMember">Group Member</option>
                <option value="GroupLeader">Group Leader</option>
            </select>
            <label htmlFor="dobf">Date of Birth</label>
            <input type="date" className="form-control" id="dobf"
                   onChange={e => this.changeDob(e.target.value)}
                   defaultValue={this.state.dob}/>
        </div>)
    }

    // Disable input fields, hide private info
    renderOtherPage = () => {
        return (<div>
            <label htmlFor="fname">First name</label>
            <input type="text" className="form-control" id="fname" disabled
                   onChange={e => this.changeFirstName(e.target.value)}
                   defaultValue={this.state.firstname}/>
            <label htmlFor="lname">Last name</label>
            <input type="text" className="form-control" id="lname" disabled
                   onChange={e => this.changeLastName(e.target.value)}
                   defaultValue={this.state.lastname}/>
            <label htmlFor="rolef">Role</label>
            <select className="form-control" id="rolef" disabled
                   onChange={e => this.changeRole(e.target.value)}
                   value={this.state.role}>
                <option value="GroupMember">Group Member</option>
                <option value="GroupLeader">Group Leader</option>
            </select>
        </div>)
    }

    render() {
        var ownPage = this.state.curUser === this.state.pageId;
        console.log(this.props.userId)

        return (
            <div>
                {this.props.userId === null &&
                    <span>Please login before viewing profiles.</span>
                }
                {this.props.userId !== null &&
                    <div>
                        {ownPage && <h3>Your Profile</h3>}
                        {!ownPage && <h3>{this.state.username}'s Profile</h3>}
                        {ownPage && this.renderMyPage()}
                        {!ownPage && this.renderOtherPage()}
                        <button className="btn btn-danger"
                                onClick={() => this.props.logout()}>
                            Logout
                        </button>
                    </div>
                }
            </div>
        );
    }
}
