import  { React, useState, useEffect } from 'react';
import styled from 'styled-components';
import oc from 'open-color';
import { firebase } from "../../firebase";
import { getFirestore, collection, getDocs } from "firebase/firestore";
import { getStorage, getDownloadURL, StorageReference, FirebaseStorage } from "firebase/storage";
import { Link } from "react-router-dom";

const Positioner = styled.div`
    display: flex;
    justify-content: space-around;
    flex-wrap: wrap;
    width: 100%;
`;
const Content = styled(Link)`
    display: inline-flex;
    flex-direction: column;
    background-color: orange;
    margin: 1%;
    width: 27%;
    height: 350px;
    color: black;
    &:nth-child(1),&:nth-child(2),&:nth-child(3) {
        margin-top: 100px;
    }
`;
const MainImage = styled.img`
    flex: 3;
    max-height: 70%;
    max-width: 100%;
    object-fit: contain;
`
const TeamName = styled.div`
    flex:1;
    margin-left: 30px;
    margin-top: 10px;
    font-size: 23px;
`
const TeamDesc = styled.div`
    flex:2;
    margin-left: 30px;
    margin-right: 30px;
    font-size: 13px;
`

const Contents = ({ year }) => {
    const [content, setContent] = useState([]);

    useEffect(() => {
        const FetchContents = async () => {
            const db = getFirestore();
            const data = await getDocs(collection(db, year.toString()));
        
            setContent(data.docs.map((doc) => ({...doc.data(), id: doc.id})));            
        };
        FetchContents();
    },[])
    
    const list = content.map((doc, index) => (
            <Content 
                key={index} 
                to={`/detailedPage/${index}`} 
                onClick={() => {console.log(index)}}
                style={{ textDecoration: 'none' }}
            >
                <MainImage src={doc.image_url}></MainImage>
                <TeamName>{doc.team_name}</TeamName>
                <TeamDesc>Example team description... I need to fetch desc later!!! happy coding!!</TeamDesc>
            </Content>
    ));
    
    return (
        <Positioner>
            {list}
        </Positioner>
    );
}

export default Contents;
