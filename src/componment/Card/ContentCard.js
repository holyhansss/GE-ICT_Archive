import React from 'react';

import { Card } from 'react-bootstrap';

const ContentCard = (props) => {

    const doc = props.doc;
    
    return (
        <Card>
            <Card.Img variant="top" src={doc.image_url} style={{height: '270px'}}/>
            <Card.Body>
                <Card.Title>{doc.teamName}</Card.Title>
                {/* <Card.Text> */}
                {
                    doc.hashTag !== undefined
                        ? doc
                            .hashTag
                            .map(
                                (tag, index) => <div
                                    key={index}
                                    style={{
                                        display: 'inline-block',
                                        padding: "2px 5px 2px 5px",
                                        fontSize: "13px",
                                        fontWeight: "bold"
                                    }}>#{tag}</div>
                            )
                        : <></>
                }
                {/* </Card.Text> */}
            </Card.Body>
        </Card>
    );
}

export default ContentCard;