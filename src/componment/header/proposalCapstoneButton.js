import styled from "styled-components";
import oc from 'open-color';
import { Link } from "react-router-dom";


const LoginButtonCover = styled.div`
    width: 15%;
    margin-top: 15px;
    margin-left: 10px;
    height: 35px;
`
const LoginButtondiv = styled.div`
    background-color: ${oc.teal[7]};
    color: white;
    text-align: center;
    height: 80%;
    border-radius: 24px;
    cursor: pointer;
`
const LoginButtonText = styled.span`
    justify-content: center;
    font-weight: bolder;
    font-family: 'Rajdhani';
`
const ProposalCapstoneButton = () => {
    return (
        <LoginButtonCover>
            <Link to="/proposalpage" style={{ textDecoration: 'none' }}>
                <LoginButtondiv>
                    <LoginButtonText>Proposal</LoginButtonText>
                </LoginButtondiv>
            </Link>
        </LoginButtonCover>
    );

}
export default ProposalCapstoneButton;
