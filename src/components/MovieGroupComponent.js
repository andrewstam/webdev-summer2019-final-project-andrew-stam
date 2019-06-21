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
            groupIdToWatchItemArrayMap: {},
            memberIdToUsernameMap: {},
            leaderIdToUsernameMap: {},
            movieIdToTitleMap: {},
            watchItemIdToCommentArrayMap: {}
        };

        /* groupIdToWatchItemArrayMap looks like:
            {
                1: [    //groupId=1
                    {
                        itemId: 1,
                        groupId: 1,
                        movieId: tt000,
                        watchDate: 2019-06-22
                    },
                    {
                        itemId: 2,
                        groupId: 1,
                        movieId: tt001,
                        watchDate: 2019-06-29
                    }
                ],
                2: [    //groupId=2
                    {
                        itemId: 3,
                        groupId: 2,
                        movieId: tt005,
                        watchDate: 2019-06-25
                    }
                ]
            }
        */

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
                service.findGroupWatchItems(id, this.getWatchItems);
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

    // Get the watch items associated with each group from the database
    getWatchItems = json => {
        // JSON looks like: ["3,2,tt0093779,2019-06-25"]
        // Items are: id, groupId, movieId, watchDate
        for (let idx in json) {
            var watchItemTokens = json[idx].split(',');
            var obj = {
                id: watchItemTokens[0],
                groupId: watchItemTokens[1],
                movieId: watchItemTokens[2],
                watchDate: watchItemTokens[3]
            };
            var map = this.state.groupIdToWatchItemArrayMap;
            // Add watch item to the array - if it doesn't exist yet, initialize the array with one element
            map[obj.groupId] = map[obj.groupId] ? ([...map[obj.groupId], obj]) : [obj];
            this.setState({groupIdToWatchItemArrayMap: map})
            // Load movie title from its id by calling omdb API
            var url = 'https://www.omdbapi.com';
            // My personal API key, do not duplicate or reuse without permission
            url += '?apikey=abfe6d09';
            url += '&i=' + obj.movieId;
            fetch(url)
            .then(res => res.json())
            .then(mov => {
                var movieMap = this.state.movieIdToTitleMap;
                movieMap[mov.imdbID] = mov.Title;
                this.setState({movieIdToTitleMap: movieMap});
            });
            // Load watch item comments
            //watchItemIdToCommentArrayMap
            service.findItemComments(obj.id, this.loadComments);
        }
    }

    // Load comments for each watch item (user id and text)
    loadComments = json => {
        for (let idx in json) {
            // idx=0 : commentId, idx=length-1 : watchItemId, idx=length-2: userId, middle : comment text
            var tokens = json[idx].split(',');
            var obj = {
                id: tokens[0],
                // If text had commas, rejoin the tokens and put the commas back
                text: tokens.slice(1, tokens.length - 2).join(','),
                userId: tokens[tokens.length - 2],
                watchItemId: tokens[tokens.length - 1]
            };
            var map = this.state.watchItemIdToCommentArrayMap;
            // Add comment to the array - if it doesn't exist yet, initialize the array with one element
            map[obj.watchItemId] = map[obj.watchItemId] ? ([...map[obj.watchItemId], obj]) : [obj];
            this.setState({watchItemIdToCommentArrayMap: map});
        }
    }

    render() {
        // default is GroupMember
        var leader = this.props.userObj ? this.props.userObj.role === 'GroupLeader' : false;

        return (
            <div>
                {leader &&
                    <div>
                        <h1>Movie Groups</h1>
                        <h3>Group Leader</h3>
                    </div>
                }
                {!leader && this.state.groupId === null &&
                    <div>
                        <h1>Movie Groups</h1>
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
                        <h1>{this.state.groupIdToNameMap[this.state.groupId]}</h1>
                        <button className="btn btn-secondary wbdv-btn-shadow" onClick={() => this.changePage(null)}>
                            <Link to={`/groups`} className="wbdv-group-btn-text">Back to groups</Link>
                        </button>
                    {!leader &&
                        <div className="form-control wbdv-group">
                            <h5>Watch Items</h5>
                            {this.state.groupIdToWatchItemArrayMap[this.state.groupId] &&
                                this.state.groupIdToWatchItemArrayMap[this.state.groupId].map(watchItem => {
                                    return (
                                        <div key={watchItem.id} className="form-control wbdv-watch-item">
                                            <div className="row">
                                                <div className="col-sm-4">
                                                    Title: <Link to={`/details/${watchItem.movieId}`}>
                                                        {this.state.movieIdToTitleMap[watchItem.movieId]}
                                                    </Link>
                                                </div>
                                                <div className="col-sm-2">
                                                    Date: {watchItem.watchDate}
                                                </div>
                                            </div>
                                            <div className="row">
                                                <h6 className="col-sm-1">Comments:</h6>
                                            </div>
                                            {this.state.watchItemIdToCommentArrayMap[watchItem.id] &&
                                                this.state.watchItemIdToCommentArrayMap[watchItem.id].map(c =>
                                                    <div className="row" key={c.id}>
                                                        <div className="col-sm-1">
                                                            <Link to={`/profile/${c.userId}`} onClick={() => this.props.setPage('profile')}>
                                                                <b>{this.state.memberIdToUsernameMap[c.userId]}</b>
                                                            </Link>
                                                            :
                                                        </div>
                                                        <div className="col-sm-8">
                                                            {c.text}
                                                        </div>
                                                        <hr/>
                                                    </div>
                                            )}
                                        </div>
                                    )
                            })}
                        </div>
                    }
                    </div>
                }
            </div>
        );
    }
}
