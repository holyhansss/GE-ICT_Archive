import React from 'react';
import styled from 'styled-components';
import oc from 'open-color';

const StyledFooterWrapper = styled.footer`
    display: flex;
    justify-content: center;
    align-items: center;
    width: 100%;
    height: 62px;
    margin-top: auto;
`;
const StyledFooter = styled.p`
    @include content-max-width;
    text-align: center;
`;

const Footer = () => {
    const thisYear = () => {
        const year = new Date().getFullYear();
        return year;
    };

    return (
        <StyledFooterWrapper>
            <StyledFooter>
                © {thisYear()}
                &nbsp; 
                <a href={"https://github.com/holyhansss"}>
                    한성원
                </a>
                    &nbsp; 
                    powered by
                    &nbsp;
                <a href="https://github.com/holyhansss/GE-ICT_Capstone_Website">
                    holyhansss
                </a>
            </StyledFooter>
        </StyledFooterWrapper>
    )
};

export default Footer;
