import {useEffect, useState} from 'react';

import firebase from '../../firebase';
import {getAuth, signInWithPopup, GoogleAuthProvider, signOut} from "firebase/auth";
import {getDocs, query, collection, getFirestore} from "firebase/firestore";
import {Link, useNavigate} from 'react-router-dom';

import {Navbar, Nav, Container, NavDropdown} from 'react-bootstrap';

const Header = () => {

    const navigate = useNavigate();
    const [user, setUser] = useState(null);
    const [professors, setProfessors] = useState([]);
    const auth = getAuth();
    const db = getFirestore();

    useEffect(() => {}, [user]);

    useEffect(() => {
        const FetchContents = async () => {
            const professorData = await getDocs(query(collection(db, "professors")))
            professorData.forEach((professorInfo) => {
                setProfessors(professorList => [
                    ...professorList,
                    professorInfo
                        .data()
                        .email
                ])
            })
        };
        FetchContents();
    }, [])

    const handleLoginClick = async () => {
        let googleProvider = new GoogleAuthProvider;
        await signInWithPopup(auth, googleProvider);
        setUser(auth.currentUser);
        navigate("/");
    }
    const handleLogoutClick = async () => {
        await signOut(auth);
        setUser(null);
        navigate("/");
    }
    const handleProposalClick = () => {
        if (auth.currentUser !== null && auth.currentUser.email.includes("@handong.ac.kr")) {
            navigate("/proposalpage");
        } else {
            alert('please login with handong offical email');
        }
    }
    return (

        <Navbar
            collapseOnSelect="collapseOnSelect"
            expand="lg"
            bg="dark"
            variant="dark"
            className='navBar'>
            <Container>
                <Navbar.Brand href="/">GE & ICT</Navbar.Brand>
                <Navbar.Toggle aria-controls="responsive-navbar-nav"/>
                <Navbar.Collapse id="responsive-navbar-nav">
                    <Nav className="me-auto">
                        <div
                            style={{
                                color: "white",
                                fontSize: "15px"
                            }}>Creation Beyond Technology</div>
                    </Nav>
                    {

                        auth.currentUser === null
                            ? <Nav>
                                    <Nav.Link onClick={handleLoginClick}>Login</Nav.Link>
                                </Nav>
                            : professors.includes(auth.currentUser.email)
                                ? <Nav>
                                        <Nav.Link href="/professorApprovalpage">Approval</Nav.Link>
                                        <Nav.Link onClick={handleProposalClick}>Proposal</Nav.Link>
                                        <Nav.Link onClick={handleLogoutClick}>Logout</Nav.Link>
                                    </Nav>
                                : <Nav>
                                        <Nav.Link href="/proposalpage">Proposal</Nav.Link>
                                        <Nav.Link onClick={handleLogoutClick}>Logout</Nav.Link>
                                    </Nav>
                    }

                </Navbar.Collapse>
            </Container>
        </Navbar>
    );
};

export default Header;
