// Created by Andrew Stam
import React from 'react';

const ResultItem = ({title, img}) =>
    <div>
        <div className="form-control"><strong>{title}</strong></div>
        <img src={img}/>
    </div>

export default ResultItem;
