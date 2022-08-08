import React from 'react';

import {Link} from "react-router-dom";

import { Card } from 'react-bootstrap';
import ContentCard from './ContentCard';

const LinkedContentCard = (props) => {

    const doc = props.doc;
    const pathname = props.pathname;
    const stateFroLink = props.stateForLink;

    return (
        <Link 
            to={{
                pathname: pathname,
            }}
            state={stateFroLink}
            style={{textDecoration: 'none', color: 'black'}}
            >
            <ContentCard doc={doc}/>
        </Link>
    );
}

export default LinkedContentCard;