import React from "react";
import styled from "styled-components";
import oc from 'open-color';
import { useDispatch, useSelector } from "react-redux";
import { login, logout } from "../../features/login_state"
const LoginButtonText = styled.span`
    justify-content: center;
    font-weight: bolder;
    font-family: 'Rajdhani';

`

const LoginButtonCover = styled.div`
    width: 25%;
    margin-top: 15px;
    margin-right: 100px;
    height: 35px;
`
const LoginButtondiv = styled.div`
    background-color: ${oc.teal[7]};
    color: white;
    text-align: center;
    margin-right 40%;
    height: 80%;
    border-radius: 24px;
    cursor: pointer;

    `
const LoginButton = ({handleLoginClick}) => {
    const loginState = useSelector((state) => state.loginState);

    const handleClick = () => {
        handleLoginClick()
    }
    
    return (
         <LoginButtonCover>
            <LoginButtondiv onClick={handleClick}>
                <LoginButtonText>Sign In</LoginButtonText>
            </LoginButtondiv>
         </LoginButtonCover>
    );

}
export default LoginButton;
