import styled from "styled-components";
import oc from 'open-color';
import { Link } from "react-router-dom";


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
    width: 40%;
    height: 80%;
    border-radius: 24px;
    cursor: pointer;
`
const LoginButtonText = styled.span`
    justify-content: center;
    font-weight: bolder;
    font-family: 'Rajdhani';
`
const ProposalCapstone = () => {
    return (
        <LoginButtonCover>
            <Link to="/ProposalPage" style={{ textDecoration: 'none' }}>
                <LoginButtondiv>
                    <LoginButtonText>Proposal</LoginButtonText>
                </LoginButtondiv>
            </Link>
        </LoginButtonCover>
    );

}
export default ProposalCapstone;
