// Created by Andrew Stam
import React from 'react';
import {Link} from 'react-router-dom';
import './MovieGroupComponent.css';
import UserService from '../services/UserService';
const service = UserService.getInstance();

export default class MovieGroupComponent extends React.Component {
    constructor(props) {
        super(props);

        const pathname = window.location.pathname;
        const paths = pathname.split('/');
        const groupId = paths.length > 2 ? paths[2] : null;

        // default is GroupMember
        var leader = this.props.userObj ? this.props.userObj.role === 'GroupLeader' : false;

        this.state = {
            groupId: groupId,
            leaderView: leader,
            userObj: this.props.userObj,
            groups: [],
            groupIdToLeaderIdMap: {},
            groupIdToNameMap: {},
            groupIdToMemberIdArrayMap: {},
            memberIdToUsernameMap: {},
            leaderIdToUsernameMap: {}
        };

        this.props.setPage('groups');
    }

    componentWillReceiveProps(props) {
        if (this.props !== props) {
            this.props = props;
        }
    }

    // Load groups from backend
    componentDidMount = () => {
        if (localStorage.getItem('curUser')) {
            var cur = localStorage.getItem('curUser');
            service.findUserGroups(cur, this.loadGroupIds);
        }
    }

    // Change which group is being shown, rendering changes
    changePage = id => {
        this.setState({groupId: id});
    }

    // Loads group ids from backend
    loadGroupIds = json => {
        if (json) {
            json.forEach(id => {
                service.findGroupById(id, this.getGroupInfo);
                service.findGroupMemberIds(id, this.getGroupMemberIds);
                this.setState({groups: [...this.state.groups, id]});
            })
        }
    }

    // From group id, get group leader id and group name from database and then load details
    getGroupInfo = json => {
        service.findUserById(json.leaderId, this.loadGroupLeader);
        var map = this.state.groupIdToLeaderIdMap;
        map[json.groupId] = json.leaderId;
        this.setState({groupIdToLeaderIdMap: map});

        var nameMap = this.state.groupIdToNameMap;
        nameMap[json.groupId] = json.name;
        this.setState({groupIdToNameMap: nameMap});
    }

    // Have details about leader, load into state
    loadGroupLeader = json => {
        var map = this.state.leaderIdToUsernameMap;
        map[json.id] = json.username;
        this.setState({leaderIdToUsernameMap: map});
    }

    // Get the IDs of all members per group, then call backend to find all usernames
    getGroupMemberIds = (json, gid) => {
        var map = this.state.groupIdToMemberIdArrayMap;
        map[gid] = json;
        this.setState({groupIdToMemberIdArrayMap: map});
        json.forEach(id => service.findUserById(id, this.loadGroupMembers));
    }

    // Load member usernames into state
    loadGroupMembers = json => {
        var map = this.state.memberIdToUsernameMap;
        map[json.id] = json.username;
        this.setState({memberIdToUsernameMap: map});
    }

    render() {
        // default is GroupMember
        var leader = this.props.userObj ? this.props.userObj.role === 'GroupLeader' : false;
        return (
            <div>
                <h1>Movie Groups</h1>
                {leader && <h3>Group Leader</h3>}
                {!leader && this.state.groupId === null &&
                    <div>
                        <h3>Group Member</h3>
                        {this.state.groupIdToLeaderIdMap &&
                            Object.keys(this.state.groupIdToLeaderIdMap).map(id => {
                                return (
                                <div className="form-control wbdv-group" key={id}>
                                    <h4>{this.state.groupIdToNameMap[id]}</h4>
                                    <h5>Leader: <Link to={`/profile/${this.state.groupIdToLeaderIdMap[id]}`}>
                                        {this.state.leaderIdToUsernameMap[this.state.groupIdToLeaderIdMap[id]]}</Link>
                                    </h5>
                                    <div className="container">
                                        <div className="row">
                                            <h6 className="wbdv-row col-sm-1">Members:</h6>
                                            {this.state.groupIdToMemberIdArrayMap[id] &&
                                                this.state.groupIdToMemberIdArrayMap[id].map(mid => {
                                                    return (
                                                        <div className="col-sm-1" key={mid}>
                                                            <Link to={`/profile/${mid}`}>
                                                                {this.state.memberIdToUsernameMap[mid]}
                                                            </Link>
                                                        </div>
                                                    )
                                                })
                                            }
                                        </div>
                                        <div className="row wbdv-group-link">
                                            <Link to={`/groups/${id}`} onClick={() => this.changePage(id)}>See group details...</Link>
                                        </div>
                                    </div>
                                </div>
                                )
                            })
                        }
                    </div>
                }
                {this.state.groupId !== null &&
                    <div>
                        <button className="btn btn-secondary wbdv-btn-shadow" onClick={() => this.changePage(null)}>
                            <Link to={`/groups`} className="wbdv-group-btn-text">Back to groups</Link>
                        </button>
                    </div>
                }
            </div>
        );
    }
}
