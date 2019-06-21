// Created by Andrew Stam
import React from 'react';
import {Link} from 'react-router-dom';
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
            gid: groupId,
            leaderView: leader,
            userObj: this.props.userObj,
            groups: [],
            groupIdToLeaderIdMap: {},
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

    // Loads group ids from backend
    loadGroupIds = json => {
        if (json) {
            json.forEach(id => {
                service.findGroupById(id, this.getGroupLeader);
                service.findGroupMemberIds(id, this.getGroupMemberIds);
                this.setState({groups: [...this.state.groups, id]});
            })
        }
    }

    // From group id, get group leader id from database and then load details
    getGroupLeader = json => {
        service.findUserById(json.leaderId, this.loadGroupLeader);
        var map = this.state.groupIdToLeaderIdMap;
        map[json.groupId] = json.leaderId;
        this.setState({groupIdToLeaderIdMap: map});
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
                <h1>Movie Group</h1>
                {leader && <h3>Group Leader</h3>}
                {!leader &&
                    <div>
                        <h3>Group Member</h3>
                        {this.state.groupIdToLeaderIdMap &&
                            Object.keys(this.state.groupIdToLeaderIdMap).map(id => {
                                return (
                                <div className="form-control" key={id}>
                                    <h5>Leader: <Link to={`/profile/${this.state.groupIdToLeaderIdMap[id]}`}>
                                        {this.state.leaderIdToUsernameMap[this.state.groupIdToLeaderIdMap[id]]}</Link>
                                    </h5>
                                    <h6>Members:</h6>
                                    {this.state.groupIdToMemberIdArrayMap[id] &&
                                        this.state.groupIdToMemberIdArrayMap[id].map(mid => {
                                            return (
                                                <div className="col-sm-2" key={mid}>
                                                    <Link to={`/profile/${mid}`}>
                                                        {this.state.memberIdToUsernameMap[mid]}
                                                    </Link>
                                                </div>
                                            )
                                        })
                                    }
                                </div>
                                )
                            })
                        }
                    </div>
                }
            </div>
        );
    }
}
