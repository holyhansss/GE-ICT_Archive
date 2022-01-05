import React from "react";
import styled from "styled-components";
import oc from 'open-color';
import { useSelector } from "react-redux";

const LoginButtonText = styled.span`
    justify-content: center;
    font-weight: bolder;
    font-family: 'Rajdhani';

`

const LoginButtonCover = styled.div`
    flex: 1;
    margin-top: 15px;
    height: 35px;
    direction: rtl;

`
const LoginButtondiv = styled.div`
    background-color: ${oc.teal[7]};
    color: white;
    text-align: center;
    margin-right 40%;
    width: 20%;
    height: 80%;
    border-radius: 24px;
    cursor: pointer;

    `
const LogoutButton = ({handleLogoutClick}) => {
    const loginState = useSelector((state) => state.loginState);

    const handleClick = () => {
        handleLogoutClick()
        console.log("signOut")
    }
    
    return (
         <LoginButtonCover>
            <LoginButtondiv onClick={handleClick}>
                <LoginButtonText>Sign Out</LoginButtonText>
            </LoginButtondiv>
         </LoginButtonCover>
    );

}
export default LogoutButton;
