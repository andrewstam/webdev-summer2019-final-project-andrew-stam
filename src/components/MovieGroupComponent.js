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
            watchItemIdToCommentArrayMap: {},
            watchItemIdToAttendingMap: {},
            watchItemToCommentTextMap: {}
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

    // Change the text for a watch item comment
    doTextChange = (text, wid) => {
        var map = this.state.watchItemToCommentTextMap;
        map[wid] = text;
        this.setState({watchItemToCommentTextMap: map});
    }

    // Submit comment and clear text field to rerender page
    doCommentSubmit = wid => {
        this.setState({watchItemToCommentTextMap: map});
        service.addComment(this.state.watchItemToCommentTextMap[wid], localStorage.getItem('curUser'), wid, this.loadNewComments);
        var map = this.state.watchItemToCommentTextMap;
        map[wid] = '';
    }

    // Delete comment
    doCommentDelete = (wid, cid) => {
        service.removeComment(localStorage.getItem('curUser'), wid, cid);
        var map = this.state.watchItemIdToCommentArrayMap;
        var arr = map[wid].filter(elt => elt.id !== cid);
        map[wid] = arr;
        this.setState({watchItemIdToCommentArrayMap: map});
    }

    // Changed comments for given watch item
    loadNewComments = (json, wid) => {
        var map = this.state.watchItemIdToCommentArrayMap;
        // Clear out array
        map[wid] = [];
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
            // If array doesn't exist yet, initialize the array with one element, otherwise add to array
            map[wid] = map[wid] ? ([...map[wid], obj]) : [obj];
            this.setState({watchItemIdToCommentArrayMap: map});
        }
        var rMap = this.state.watchItemToCommentTextMap ? this.state.watchItemToCommentTextMap : {};
        this.setState({watchItemToCommentTextMap: rMap});
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
            service.findItemComments(obj.id, this.loadComments);
            // Load watch item attending list
            service.findAttendingMembers(obj.id, this.loadAttending);
        }
    }

    // Load the ids of the users who are attending
    loadAttending = (json, wid) => {
        var map = this.state.watchItemIdToAttendingMap;
        map[wid] = json;
        this.setState({watchItemIdToAttendingMap: map});
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

    // Toggle if the logged in user is attending the given watch item
    toggleAttending = wid => {
        var cur = localStorage.getItem('curUser');
        if (!this.state.watchItemIdToAttendingMap[wid].includes(parseInt(cur))) {
            service.addAttendingMember(wid, cur);
            var map = this.state.watchItemIdToAttendingMap;
            // Add to state array
            map[wid] = map[wid] ? [...map[wid], parseInt(cur)] : [parseInt(cur)];
            this.setState({watchItemIdToAttendingMap: map});
        } else {
            service.removeAttendingMember(wid, cur);
            var map = this.state.watchItemIdToAttendingMap;
            // Remove from state array
            var arr = map[wid].filter(item => item !== parseInt(cur));
            map[wid] = arr;
            this.setState({watchItemIdToAttendingMap: map});
        }
    }

    render() {
        // default is GroupMember
        var leader = this.props.userObj ? this.props.userObj.role === 'GroupLeader' : false;
        var cur = localStorage.getItem('curUser');

        return (
            <div className="wbdv-group-container">
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
                        <button className="btn btn-secondary wbdv-btn-shadow wbdv-group-btn" onClick={() => this.changePage(null)}>
                            <Link to={`/groups`} className="wbdv-group-btn-text">Back to groups</Link>
                        </button>
                    {!leader &&
                        <div className="form-control wbdv-group">
                            <h5>Watch Items</h5>
                            {this.state.groupIdToWatchItemArrayMap[this.state.groupId] &&
                                this.state.groupIdToWatchItemArrayMap[this.state.groupId].map(watchItem => {
                                    return (
                                        <div key={watchItem.id} className="form-control wbdv-watch-item">
                                            <div className="row wbdv-group">
                                                <div className="col-sm-6">
                                                    <h4>Title: <Link to={`/details/${watchItem.movieId}`}>
                                                        {this.state.movieIdToTitleMap[watchItem.movieId]}
                                                    </Link></h4>
                                                </div>
                                                <div className="col-sm-4">
                                                    Date: {watchItem.watchDate}
                                                </div>
                                                {this.state.watchItemIdToAttendingMap[watchItem.id] &&
                                                    <div className="col-sm-2">
                                                        {this.state.watchItemIdToAttendingMap[watchItem.id].includes(parseInt(cur)) &&
                                                            <input type="checkbox" checked id="attend"
                                                                   onChange={() => this.toggleAttending(watchItem.id)}/>
                                                        }
                                                        {!this.state.watchItemIdToAttendingMap[watchItem.id].includes(parseInt(cur)) &&
                                                            <input type="checkbox" id="attend"
                                                                   onChange={() => this.toggleAttending(watchItem.id)}/>
                                                        }
                                                        <label htmlFor="attend">Attending?</label>
                                                    </div>
                                                }
                                            </div>
                                            <div className="row wbdv-row wbdv-group">
                                                <h6 className="col-sm-1">Attending:</h6>
                                                {this.state.watchItemIdToAttendingMap[watchItem.id] &&
                                                    this.state.watchItemIdToAttendingMap[watchItem.id].map(m =>
                                                        <div className="col-sm-1" key={m}>
                                                            <Link to={`/profile/${m}`}>
                                                                {this.state.memberIdToUsernameMap[m]}
                                                            </Link>
                                                        </div>
                                                    )
                                                }
                                            </div>
                                            <div className="row wbdv-group">
                                                <h6 className="col-sm-1">Comments:</h6>
                                            </div>
                                            {this.state.watchItemIdToCommentArrayMap[watchItem.id] &&
                                                this.state.watchItemIdToCommentArrayMap[watchItem.id].map(c =>
                                                <div className="row wbdv-group" key={c.id}>
                                                    <div className="col-sm-1">
                                                        <Link to={`/profile/${c.userId}`} onClick={() => this.props.setPage('profile')}>
                                                            <b>{this.state.memberIdToUsernameMap[c.userId]}</b>
                                                        </Link>
                                                        :
                                                    </div>
                                                    <div className="col-sm-8">
                                                        {c.text}
                                                    </div>
                                                    {c.userId === cur &&
                                                        <i className="fa fa-times float-right wbdv-delete-fav"
                                                                onClick={() => this.doCommentDelete(watchItem.id, c.id)} />
                                                    }
                                                    <hr/>
                                                </div>
                                            )}
                                            {this.state.watchItemToCommentTextMap &&
                                                <div className="row wbdv-group container-fluid">
                                                    <h6 className="col-sm-2">Add comment:</h6>
                                                    <textarea type="text" className="form-control" id="rtext"
                                                              onChange={e => this.doTextChange(e.target.value, watchItem.id)}
                                                              value={this.state.watchItemToCommentTextMap[watchItem.id]}/>
                                                    <button className="btn btn-success wbdv-add-comment-btn"
                                                            onClick={() => this.doCommentSubmit(watchItem.id)}>Add</button>
                                                </div>
                                            }
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
