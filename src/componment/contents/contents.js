import { React, useState, useEffect } from "react";

import { firebase } from "../../firebase";
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
} from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { useNavigate, Link } from "react-router-dom";
import { useBottomScrollListener } from "react-bottom-scroll-listener";

import { Card, Row, Col, Form, Button } from "react-bootstrap";

import { ICT_COURSES } from "../../commons/constants";
import ContentCard from "../Card/ContentCard";
import LinkedContentCard from "../Card/LinkedContentCard";

const Contents = () => {
  const db = getFirestore();
  const auth = getAuth();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [content, setContent] = useState([]);
  const [course, setCourse] = useState("제품 기획 및 개발");
  const [selectedCourse, setSelectedCourse] = useState("제품 기획 및 개발");
  const [lastVisible, setLastVisible] = useState(0);
  const [searchKeyword, setSearchKeyword] = useState("");
  const [lock, setLock] = useState(false);

  const getFirestContents = async () => {
    setContent([]);
    let q = await query(
      collection(db, "CourseProjects"),
      where("course", "==", selectedCourse),
      where("approved", "==", true),
      limit(9),
      orderBy("createdAt", "desc")
    );
    await getDocs(q).then((snapshot) => {
      setContent((contents) => {
        const arr = [...contents];
        snapshot.forEach((doc) => {
          arr.push({
            ...doc.data(),
            id: doc.id,
          });
        });
        return arr;
      });
      if (snapshot.docs.length === 0) {
        setLastVisible(-1);
      } else {
        setLastVisible(snapshot.docs[snapshot.docs.length - 1]);
      }
    });
  };

  const getNextContents = async () => {
    if (lock) return;
    else setLock(true);

    let q;
    // orderBy와 startAfter은 같아야함
    // https://dev.to/hadi/infinite-scroll-in-firebase-firestore-and-react-js-55g3

    console.log("heheh");
    if (lastVisible === -1) {
      return;
    } else if (lastVisible) {
      q = await query(
        collection(db, "CourseProjects"),
        where("course", "==", selectedCourse),
        where("approved", "==", true),
        limit(6),
        orderBy("createdAt", "desc"),
        startAfter(lastVisible)
      );
    }

    if (lastVisible !== -1 && q !== undefined) {
      await getDocs(q).then((snapshot) => {
        setContent((contents) => {
          const arr = [...contents];

          snapshot.forEach((doc) => {
            arr.push({
              ...doc.data(),
              id: doc.id,
            });
          });
          return arr;
        });
        if (snapshot.docs.length === 0) {
          setLastVisible(-1);
        } else {
          setLastVisible(snapshot.docs[snapshot.docs.length - 1]);
        }
      });
    }
    setLock(false);
  };
  const getNewCourseContents = async () => {
    if (selectedCourse !== course) {
      setContent([]);
      setCourse(selectedCourse);
      setLastVisible(0);
      getFirestContents();
      console.log(selectedCourse, course);
    }
  };

  const handleSearchSubmit = () => {
    navigate("/searchpage", {
      state: {
        searchKeyword: searchKeyword,
      },
    });
  };
  const handleCardClick = (index, doc) => {
    navigate(`/detailpages/${index}`, {
      state: {
        id: index,
        course: doc.course,
        contentInfo: doc,
      },
    });
  };

  useEffect(() => {
    getFirestContents();
    setLoading(false);
  }, []);

  useEffect(() => {}, [content]);
  useEffect(() => {}, [course]);

  useBottomScrollListener(getNextContents);

  return (
    <div className="my-4">
      <Row className="d-flex">
        <Form
          className="mb-4 d-flex col"
          onSubmit={handleSearchSubmit}
          style={{
            display: "inline-block",
            marginLeft: "100px",
            width: "300px",
          }}
        >
          <Form.Group controlId="formSearch">
            <Form.Control
              onChange={(e) => {
                setSearchKeyword(e.target.value);
              }}
              placeholder="검색어를 입력하세요"
            />
          </Form.Group>
        </Form>

        <Form
          className="col"
          style={{
            marginRight: "100px",
          }}
        >
          <Button
            className="float-end "
            onClick={() => {
              setContent([]);
              getNewCourseContents();
            }}
            style={{}}
          >
            이동
          </Button>
          <Form.Select
            className="float-end"
            onChange={(e) => {
              if (e.target.value !== "IDEA CENTER") {
                setSelectedCourse(e.target.value);
              } else {
                if (
                  auth.currentUser !== null &&
                  auth.currentUser.email.includes("@handong.ac.kr")
                ) {
                  setSelectedCourse(e.target.value);
                } else {
                  alert("Must be Login with Handong Official Email!");
                }
              }
              console.log(e.target.value);
            }}
            style={{
              display: "inline",
              width: "250px",
              marginRight: "5px",
            }}
          >
            {ICT_COURSES.map((course, index) => {
              return (
                <option key={index} value={course}>
                  {course}
                </option>
              );
            })}
          </Form.Select>
        </Form>
      </Row>

      <Row xs={1} md={3} className="mx-5 g-4">
        {content.map((doc, index) => (
          <Col
            key={index}
            className="px-5"
            style={{
              backgroundColor: "",
            }}
          >
            <LinkedContentCard
              doc={doc}
              pathname={`/detailpages/${index}`}
              stateForLink={{
                id: index,
                course: doc.course,
                contentInfo: doc,
              }}
            />
            {/* <Link
              to={{
                pathname: `/detailpages/${index}`,
              }}
              state={{
                id: index,
                course: doc.course,
                contentInfo: doc,
              }}
              style={{ textDecoration: "none", color: "black" }}
            >
              <ContentCard doc={doc}></ContentCard>
            </Link> */}
          </Col>
        ))}
      </Row>
    </div>
  );
};

export default Contents;
