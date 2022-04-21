import  { React, useState, useEffect } from 'react';

import { firebase } from "../../firebase";
import { getFirestore, collection, getDocs, where, query, limit, startAfter, startAt, orderBy, doc, updateDoc, addDoc } from "firebase/firestore";
import { useNavigate } from "react-router-dom";

// import oc from 'open-color';
//import { Card, CardHeader, CardContent, TextField, makeStyles, Select, MenuItem ,Button} from "@material-ui/core";
import { Button, Container, Card, Row, Col} from "react-bootstrap";

const ApprovalPageContent = () => {

    const db = getFirestore();
    const [content, setContent] = useState([]);
    const [loading, setLoading] = useState(true);

    const navigate = useNavigate();

    useEffect(()=> {
        const fetchContent = async () => {
            let q = await query(collection(db, 'CourseProjects'), where('approved', '==', false), orderBy('createdAt', 'desc'))
            getDocs(q).then((snapshot) => {
                setContent((contents) => {
                    const arr = [...contents]
                    snapshot.forEach((doc) => {
                        arr.push({...doc.data(), id: doc.id})
                    })
                    return arr;
                })
                
            })
            if(content.length > 0) setLoading(false);
        }
        fetchContent();        
    },[])

    useEffect(()=> {
    },[content])

    // const updatee = async () => {
    //     let q = await query(collection(db, 'CourseProjects'))
    //     getDocs(q).then(async (snapshot) => {
    //         snapshot.forEach(async (doc)=> {
    //             console.log(doc.data())
    //             await addDoc(collection(db, "CourseProjects"), doc.data());
                
    //         })
    //         //await addDoc(collection(db, "CourseProjects"), snapshot.data());
    //     })

    // }

    const handleApproval = async (e, document, index) => {
        await updateDoc(doc(db, "CourseProjects", document.id),{
            "approved": true,
        }).then((e) => {
            alert("approved!" + document.teamName);
            var filtered = content.filter(function(value, index, arr){ 
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

    // const list = content.map((doc, index) => (
    //     loading === false ?
    //     <Card key={index} className="">
    //         <Link key={index}
    //         to={`/detailpages/${index}`}
    //         state={{
    //             id: index,
    //             course: doc.course,
    //             contentInfo: doc,
    //         }}
    //         className=""
    //         style={{ textDecoration: 'none' }}
    //         >
    //             <CardContent>
    //                 <img className="" src={doc.image_url}></img>
    //             </CardContent>
    //             <CardHeader title={doc.teamName} className=""></CardHeader>
                
    //             <CardContent>
    //                 {
    //                 doc.hashTag !== undefined ?
    //                 doc.hashTag.map((tag, index)=> 
    //                     <div className="" key={index}>{tag}</div>
    //                 )
    //                 : <div></div>
    //                 }       
    //             </CardContent>
    //         </Link>
    //         <div className="" onClick={(e) => {handleApproval(e, doc, index)}}>Approve</div>
    //     </Card>
    //     : <Card key={index}></Card>
    // ));

    return (
        <div className="">{
            loading === false
            ? <Row xs={1} md={3} className="mx-5 g-4 my-3">
            {
                content.map((doc, index) => (
                    <Col
                        key={index}
                        className='px-5'>
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
                        <Button onClick={(e) => {handleApproval(e, doc, index)}} className="mt-2"> Approve </Button>
                    </Col>
                ))
            }
            </Row>
            : <Container className="" style={{
                height: '80vh',
            }}>
                  <Row className='justify-content-md-center mt-5'>
                    <Col md="auto"><h1><strong>Nothing To Approved</strong></h1></Col>
                </Row>
            </Container>
            }</div>

    );
}



export default ApprovalPageContent;
