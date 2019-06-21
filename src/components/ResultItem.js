// Created by Andrew Stam
import React from 'react';
import {Link} from 'react-router-dom';
import './ResultItem.css';

const ResultItem = ({title, did}) =>
    <div>
        <div className="form-control wbdv-result-item">
            <Link to={`/details/${did}`} className="wbdv-result-text"><strong>{title}</strong></Link>
        </div>
    </div>

export default ResultItem;
