// Created by Andrew Stam
import React from 'react';
import {Link} from 'react-router-dom';
import './HomeComponent.css';

const HomeComponent = ({userObj, nameText, renderRoleText, newestUser, setPage}) =>
    <div>
        <h3 className="wbdv-desc-text">Decide what movies to watch and when, with friends!</h3>
        {userObj !== null &&
            <div>
                <h2 className="wbdv-name-text">Welcome {nameText}</h2>
                {renderRoleText()}
            </div>
        }
        {newestUser !== null &&
            <div>
                <h5 className="wbdv-new-user-text"><i>Check out our newest user, <Link to={`/profile/${newestUser.id}`}>
                        {newestUser.username}</Link>!</i>
                </h5>
            </div>
        }
        {userObj === null &&
            <Link to="/search" className="wbdv-link"
                  onClick={() => setPage('search')}><h2 className="wbdv-search-link">Start today by searching for a movie</h2></Link>
        }
        {userObj !== null &&
            <Link to="/search" className="wbdv-link" onClick={() => setPage('search')}><h2 className="wbdv-search-link">
                <i className="fa fa-long-arrow-right"/> Search for a movie <i className="fa fa-long-arrow-left"/></h2></Link>
        }
    </div>

export default HomeComponent;
