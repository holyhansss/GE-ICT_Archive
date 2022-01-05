import './header.css'
import { useEffect, useState } from 'react';
import styled from 'styled-components';
import oc from 'open-color';
//import { shadow, media } from 'lib/styleUtils';
import LoginButton from '../auth/login';
import LogoutButton from '../auth/logout';
// import LoginForm from '../auth/loginForm';
import firebase from '../../firebase';
import { getAuth, signInWithPopup, GoogleAuthProvider, signinwith, signOut} from "firebase/auth";
import { useDispatch, useSelector } from 'react-redux';
import { login, logout } from "../../features/login_state"

// 상단 고정, 그림자    
const Positioner = styled.div`
    display: flex;
    flex-direction: column;
    position: fixed;
    top: 0px;
    width: 100%;
   
`;

// 흰 배경, 내용 중간 정렬
const WhiteBackground = styled.div`
    background: white;
    display: flex;
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
    padding-right: 1rem;
    padding-left: 1rem;
    
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
// 중간 여백
const Spacer = styled.div`
  flex: 1;
  text-align: right;
`;

// 하단 그래디언트 테두리
const GradientBorder = styled.div`
    height: 3px;
    background: linear-gradient(to right, ${oc.teal[6]}, ${oc.cyan[5]});
`;



const Header = () => {
    const [user, setUser] = useState(null);
    const auth = getAuth();
    //let user;
    //const dispatch = useDispatch();
    //const loginState = useSelector((state) => state.authSlice.loginState);


    useEffect(()=> {

    }, [user]);

    const handleLoginClick = async () => {
        let googleProvider = new GoogleAuthProvider;
        await signInWithPopup(auth, googleProvider)
        setUser(auth.currentUser)
    }
    const handleLogoutClick = async () => {
        await signOut(auth)
        setUser(auth.currentUser)
    }
    console.log(auth.currentUser)

    return (
      <Positioner>
          <WhiteBackground>
              <HeaderContents>
                  <Logo>GE & ICT CAPSTONE</Logo>
                  <Slogan>Createion beyond Technology</Slogan>
                    {auth.currentUser == null
                    ? <LoginButton handleLoginClick={handleLoginClick}></LoginButton>
                    : <LogoutButton handleLogoutClick={handleLogoutClick}></LogoutButton>
                    }
              </HeaderContents>
          </WhiteBackground>
          <GradientBorder/>
      </Positioner>
  );
};

export default Header;
