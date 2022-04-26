import {React, useState, useEffect} from 'react';

import {firebase} from "../../firebase";
import {
    getFirestore,
    collection,
    getDocs,
    where,
    query,
    limit,
    startAfter,
    startAt,
    orderBy,
    doc,
    updateDoc,
    addDoc,
    deleteDoc
} from "firebase/firestore";
import {useNavigate} from "react-router-dom";

import {Button, Container, Card, Row, Col} from "react-bootstrap";

const ApprovalPageContent = () => {

    const db = getFirestore();
    const [content, setContent] = useState([]);
    const [loading, setLoading] = useState(true);

    const navigate = useNavigate();

    useEffect(() => {
        const fetchContent = async () => {
            let q = await query(
                collection(db, 'CourseProjects'),
                where('approved', '==', false),
                orderBy('createdAt', 'desc')
            )
            getDocs(q).then((snapshot) => {
                setContent((contents) => {
                    const arr = [...contents]
                    snapshot.forEach((doc) => {
                        arr.push({
                            ...doc.data(),
                            id: doc.id
                        })
                    })
                    return arr;
                })

            })
            if (content.length > 0) 
                setLoading(false);
            }
        fetchContent();
    }, [])

    useEffect(() => {}, [content])

    const handleApproval = async (e, document, index) => {
        await updateDoc(doc(db, "CourseProjects", document.id), {"approved": true}).then(
            (e) => {
                alert("approved!" + document.teamName);
                var filtered = content.filter(function (value, index, arr) {
                    return document !== value;
                });
                setContent(filtered);

            }
        );
    }
    const handleDelete = async (e, document) => {
        await deleteDoc(doc(db, "CourseProjects", document.id)).then((e) => {
            alert(`${document.teamName} deleted!`);
            var filtered = content.filter(function (value, index, arr) {
                return document !== value;
            });
            setContent(filtered);
        });

    }

    const handleCardClick = (index, doc) => {
        navigate(`/detailpages/${index}`, {
            state: {
                id: index,
                course: doc.course,
                contentInfo: doc
            }
        });
    }

    return (
        <div className="">{
                // loading === false
                     content.length !== 0 
                    ?<Row xs={1} md={3} className="mx-5 g-4 my-3">
                            {
                                content.map((doc, index) => (
                                    <Col key={index} className='px-5'>
                                        <Card
                                            onClick={() => {
                                                handleCardClick(index, doc)
                                            }}>
                                            <Card.Img variant="top" src={doc.image_url}/>
                                            <Card.Body>
                                                <Card.Title>{doc.teamName}</Card.Title>
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
                                                <br></br>

                                            </Card.Body>
                                        </Card>
                                        <Button
                                            onClick={(e) => {
                                                handleApproval(e, doc, index)
                                            }}
                                            className="mt-2">
                                            Approve
                                        </Button>
                                        <Button
                                            onClick={(e) => {
                                                handleDelete(e, doc)
                                            }}
                                            className="mt-2 mx-3"
                                            variant='secondary'>
                                            Delete
                                        </Button>

                                    </Col>
                                ))
                            }
                        </Row>
                        : <Container
                        className=""
                        style={{
                            height: '80vh'
                        }}>
                        <Row className='justify-content-md-center mt-5'>
                            <Col md="auto">
                                <h1>
                                    <strong>Nothing To Approved</strong>
                                </h1>
                            </Col>
                        </Row>
                    </Container>
                    // : <Container
                    //         className=""
                    //         style={{
                    //             height: '80vh'
                    //         }}>
                    //         <Row className='justify-content-md-center mt-5'>
                    //             <Col md="auto">
                    //                 <h1>
                    //                     <strong>Loading</strong>
                    //                 </h1>
                    //             </Col>
                    //         </Row>
                    //     </Container>
            }</div>

    );
}

export default ApprovalPageContent;
