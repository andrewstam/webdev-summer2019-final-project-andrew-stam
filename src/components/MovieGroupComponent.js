// Created by Andrew Stam
import React from 'react';

export default class MovieGroupComponent extends React.Component {
    constructor(props) {
        super(props);

        const pathname = window.location.pathname;
        const paths = pathname.split('/');
        const groupId = paths[2];

        // default is GroupMember
        var leader = this.props.userObj ? this.props.userObj.role === 'GroupLeader' : false;

        this.state = {
            gid: groupId,
            leaderView: leader
        };
    }

    componentWillReceiveProps(props) {
        if (this.props !== props) {
            this.props = props;
        }
    }

    render() {
        return (
            <div>
                <h1>Movie Group</h1>
                {this.state.leaderView && <h3>Group Leader</h3>}
            </div>
        );
    }
}
