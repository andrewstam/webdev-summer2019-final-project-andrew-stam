// Created by Andrew Stam
import React from 'react';
import {Link} from 'react-router-dom';

const ResultItem = ({title, did}) =>
    <div>
        <div className="form-control">
            <Link to={`/details/${did}`}><strong>{title}</strong></Link>
        </div>
    </div>

export default ResultItem;
