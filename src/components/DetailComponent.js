// Created by Andrew Stam
import React from 'react';

export default class DetailComponent extends React.Component {
    constructor(props) {
        super(props);

        const pathname = window.location.pathname;
        const paths = pathname.split('/');
        const detailId = paths[2];

        this.state = {
            did: detailId,
            title: '',
            img: ''
        };
    }

    // Load details about the item with the given ID
    componentDidMount = () => {
        var url = 'http://www.omdbapi.com';
        // My personal API key, do not duplicate or reuse without permission
        url += '?apikey=abfe6d09';
        url += '&i=' + this.state.did;
        fetch(url)
        .then(res => res.json())
        .then(json => {this.setState({title: json.Title, img: json.Poster})});
    }

    render() {
        return (
            <div>
                <h4>Details for {this.state.title}</h4>
                <img className="img-fluid img-thumbnail rounded float-right" src={this.state.img}/>
            </div>
        );
    }
}
