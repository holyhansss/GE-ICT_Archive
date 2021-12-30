import  {React, useState, useEffect} from 'react';
import styled from 'styled-components';
import oc from 'open-color';
import {firebase} from "../../firebase";
import { getFirestore, collection, getDocs, doc  } from "firebase/firestore";

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
    width: 27%;
    height: 400px;
    nth-child(1) { 
        flex-grow: 1; 
    };
    &:nth-child(1),&:nth-child(2),&:nth-child(3) {
        margin-top: 100px;
    }
`;


const Contents = (props) => {
    const [content, setContent] = useState([]);
    
    useEffect(() => {
        const FetchContents = async () => {
            const db = getFirestore();
            const data = await getDocs(collection(db, "2021"));
            setContent(data.docs.map((doc) => ({...doc.data(), id: doc.id})));
        };
        FetchContents();
    },[])

    
    
    let a = ["a","b","c","a","b","c","a","b","c","a","b","c"];
    const list = a.map((doc,index) => (
        <Content key={index}>{doc}</Content>
    ));
    
    return (
        
            <Positioner>
                {list}
                
            </Positioner>
        
    );
}

export default Contents;
