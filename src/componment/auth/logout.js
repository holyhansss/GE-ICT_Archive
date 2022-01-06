import React from "react";
import styled from "styled-components";
import oc from 'open-color';

const LoginButtonText = styled.span`
    justify-content: center;
    font-weight: bolder;
    font-family: 'Rajdhani';
`
const LoginButtonCover = styled.div`
    flex: 1;
    margin-top: 15px;
    margin-left: 10px;
    height: 35px;
`
const LoginButtondiv = styled.div`
    background-color: ${oc.teal[7]};
    color: white;
    text-align: center;
    margin-right 20%;
    width: 40%;
    height: 80%;
    border-radius: 24px;
    cursor: pointer;
`
const LogoutButton = ({handleLogoutClick}) => {
    const handleClick = () => {
        handleLogoutClick()
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
