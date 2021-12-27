import React from 'react';
import styled from 'styled-components';
import oc from 'open-color';

const Positioner = styled.div`
    display: flex;
    justify-content: space-around;
    flex-wrap: wrap;
    width: 100%;
`;

const Content = styled.div`
    display: inline-flex;
    background-color: gray;
    margin: 1%;
    width: 30%;
    height: 400px;
    nth-child(1) { 
        flex-grow: 1; 
    };
    &:nth-child(1),&:nth-child(2),&:nth-child(3) {
        margin-top: 100px;
    }

`;


const Contents = ({props}) => {
    let a = ["a","b","c","a","b","c","a","b","c","a","b","c"];
    const list = a.map((kk,index) => (<Content key={index}>{kk}</Content>));
    return (
        
            <Positioner>
                {list}
            </Positioner>
        
    );
}

export default Contents;
