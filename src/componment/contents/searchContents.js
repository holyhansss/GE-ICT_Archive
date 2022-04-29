import { React, useEffect, useState } from 'react';
import { getFirestore, collection, getDocs, query, where, limit, orderBy  } from "firebase/firestore";


import { useLocation, Link, useNavigate } from 'react-router-dom';
import {Container, Card, Row, Col, Form, FloatingLabel} from 'react-bootstrap';

const SearchContents = () => {
    const db = getFirestore();
    const { state } = useLocation();
    const [loading, setLoading] = useState(true);
    const [searchKeyword, setSearchKeyword] = useState(state.searchKeyword);
    const [content, setContent] = useState([]);
    const [lastVisible, setLastVisible] = useState(0);
    const navigate = useNavigate();
    
    const handleSearchSubmit = (e) => {
        console.log(searchKeyword);
        e.preventDefault()
        if(searchKeyword !== ''  && searchKeyword !== undefined && searchKeyword !== null){
            setLastVisible(0)
            setContent([])
            getFirestContents()
        }

    }


    const getFirestContents = async () => {
        if(searchKeyword !== ''  && searchKeyword !== undefined && searchKeyword !== null /*&& content.length === 0*/){
            let q = await query(collection(db, 'CourseProjects'), where('hashTag', 'array-contains', searchKeyword), limit(9))
            getDocs(q).then((snapshot) => {
                //console.log(snapshot.docs.length);
                setContent((contents) => {
                  const arr = [...contents]
                  snapshot.forEach((doc) => {
                    arr.push({...doc.data(), id: doc.id})
                  })
                  return arr
                })
                if (snapshot.docs.length === 0) {
                    setLastVisible(-1)
                } else {
                    setLastVisible(snapshot.docs[snapshot.docs.length - 1])
                }
              })
         }
    }

    useEffect(()=> {
        getFirestContents()
        setLoading(false)
    },[])
    useEffect(()=> {
        
    })
    
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
        <>
            <Container className='justify-content-md-center mt-3' style={{
                width: '400px'
            }}>
                <form
                    noValidate 
                    autoComplete='off'
                    onSubmit={handleSearchSubmit}
                >
                    <FloatingLabel
                        controlId="floatingInput"
                        label="검색어를 입력하세요 엔터 두번 클릭!"
                        className="mb-3"
                    >
                        <Form.Control type="search" /*placeholder="제기개"*/ value={searchKeyword} onChange={(e) => {
                        setSearchKeyword(e.target.value)
                    }} />
                    </FloatingLabel>
                </form>
            </Container>
            <Row xs={1} md={3} className="mx-5 g-4">
                {
                    content.length > 0
                    ? content.map((doc, index) => (
                        <Col
                            key={index}
                            className='px-5'
                            style={{
                                backgroundColor: ''
                            }}>
                            <Card
                                onClick={() => {
                                    handleCardClick(index, doc)
                                }}>
                                <Card.Img variant="top" src={doc.image_url}/>
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
                        </Col>
                    ))
                    :
                    <Container className="" style={{
                        height: '80vh',
                    }}>
                        <Row className='justify-content-md-center mt-5'>
                            <Col md="auto"><h1>검색결과가 없습니다.</h1></Col>
                        엔터를 한번 더 클릭하면 검색 결과가 나올 수도 있어요!
                        </Row>
                    </Container>
                    
                }
            </Row>

        </>
    );
};

export default SearchContents;
