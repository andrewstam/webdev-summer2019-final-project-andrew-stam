// Created by Andrew Stam
import React from 'react';
import {Link} from 'react-router-dom';
import './HomeComponent.css';

const HomeComponent = ({userObj, nameText, renderRoleText, newestUser}) =>
    <div>
        <h2>Decide what movies to watch and when, with friends!</h2>
        {userObj !== null &&
            <div>
                <h3>Welcome {nameText}.</h3>
                {renderRoleText()}
            </div>
        }
        {newestUser !== null &&
            <div>
                <h5>Check out our newest user, <Link to={`/profile/${newestUser.id}`}>
                        {newestUser.username}</Link>!
                </h5>
            </div>
        }
        <Link to="/search" className="wbdv-link"><h2 className="wbdv-search-link">Start by searching for a movie</h2></Link>
    </div>

export default HomeComponent;
