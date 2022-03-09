import './header.css'
import { useEffect, useState } from 'react';
import styled from 'styled-components';
import oc from 'open-color';
import LoginButton from '../auth/login';
import LogoutButton from '../auth/logout';

import ProfessorApprovalPageButton from './professorApprovalButton';
import ProposalCapstoneButton from './proposalCapstoneButton';
import MyPageButton from './mypageButton';

import firebase from '../../firebase';
import { getAuth, signInWithPopup, GoogleAuthProvider, signOut} from "firebase/auth";
import { getDocs, query, collection, getFirestore } from "firebase/firestore";
import { Link, useNavigate } from 'react-router-dom';
import MyPage from '../../pages/myPage';
import { makeStyles } from "@material-ui/core";

const Header = () => {

    const navigate = useNavigate();
    const [user, setUser] = useState(null);
    const [professors, setProfessors] = useState([]);
    const auth = getAuth();
    const db = getFirestore();
    const style = useStyles();

    useEffect(()=> {
    }, [user]);

    useEffect(()=> {
        const FetchContents = async () => {
            const professorData = await getDocs(query(collection(db, "professors")))
            professorData.forEach((professorInfo) => {
              setProfessors(professorList =>[...professorList, professorInfo.data().email])
            })
          };
        FetchContents();
    },[])
    // useEffect(() => {
    //     const FetchContents = async () => {
    //         const professorData = await getDocs(query(collection(db, "professors")))
    //         professorData.forEach((professorInfo) => {
    //           setProfessors(professorList =>[...professorList, professorInfo.data().email])
    //         })
    //       };
    //     FetchContents();
    // }, [])
    


    const handleLoginClick = async () => {
        let googleProvider = new GoogleAuthProvider;
        await signInWithPopup(auth, googleProvider)
        setUser(auth.currentUser)
        navigate("/");
    }
    const handleLogoutClick = async () => {
        await signOut(auth)
        setUser(null)
        navigate("/");
        window.location.reload();
    }
    
    return (
      <Positioner>
            <WhiteBackground>
              <HeaderContents>
                  <Logo>GE & ICT</Logo>
                  <Link to="/" style={{ textDecoration: 'none' }}>
                    <Slogan>Creation Beyond Technology</Slogan>
                  </Link>
                    {auth.currentUser === null
                    ? <LogoutAndProposal>
                        <LoginButton handleLoginClick={handleLoginClick} />
                      </LogoutAndProposal>
                    : <LogoutAndProposal>
                        {professors.includes(auth.currentUser.email)
                        ? <LogoutAndProposal>
                            <ProfessorApprovalPageButton />
                            <ProposalCapstoneButton />
                            <LogoutButton handleLogoutClick={handleLogoutClick} />
                        </LogoutAndProposal>
                        : <LogoutAndProposal>
                            {/* <MyPageButton /> */}
                            <ProposalCapstoneButton />
                            <LogoutButton handleLogoutClick={handleLogoutClick} />
                        </LogoutAndProposal>  
                        }
                        
                      </LogoutAndProposal>
                    }
              </HeaderContents>
            </WhiteBackground>
          <GradientBorder/>
      </Positioner>
  );
};

export default Header;


//router쓰는 법!!
//https://velog.io/@devstone/react-router-dom-%EC%9D%B4%ED%95%B4%ED%95%98%EA%B3%A0-%ED%99%9C%EC%9A%A9%ED%95%98%EA%B8%B0
const useStyles = makeStyles({
    buttons: {
        flex: "1",
        marginTop: "15px",
        marginLeft: "10px",
        height: "35px",
    },
});

// 상단 고정, 그림자    
const Positioner = styled.div`
    display: flex;
    flex-direction: column;
    position: fixed;
    top: 0px;
    width: 100%;
    z-index: 2;
`;

// 흰 배경, 내용 중간 정렬
const WhiteBackground = styled.div`
    background: white;
    display: block;
    justify-content: left;
    height: 70px;
`;

// 해더의 내용
const HeaderContents = styled.div`
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: row;
    align-items: center;
`;

// 로고
const Logo = styled.div`
    flex: 1;
    text-align: center;
    font-size: 1.0rem;
    letter-spacing: 2px;
    color: ${oc.teal[7]};
    font-family: 'Rajdhani';
`;
const Slogan = styled.div`
    flex: 1;
    text-align: center;
    font-size: 1.5rem;
    font-weight: bold;
    letter-spacing: 2px;
    color: ${oc.teal[7]};
    font-family: 'Rajdhani';
`;

// 하단 그래디언트 테두리
const GradientBorder = styled.div`
    height: 3px;
    background: linear-gradient(to right, ${oc.teal[6]}, ${oc.cyan[5]});
`;

const LogoutAndProposal = styled.div`
    display:flex;
    flex: 1;
    justify-content: right;
`
