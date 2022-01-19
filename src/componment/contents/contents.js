import  { React, useState, useEffect, Children } from 'react';
import styled from 'styled-components';
import oc from 'open-color';
import { firebase } from "../../firebase";
import { getFirestore, collection, getDocs } from "firebase/firestore";
import { getStorage, getDownloadURL, StorageReference, FirebaseStorage } from "firebase/storage";
import { Link } from "react-router-dom";
import { Card, CardHeader, CardContent, CardActions, makeStyles} from "@material-ui/core";

const useStyles = makeStyles({
    link: {
        margin: '10px 0px 10px 0px',
        width: '30%',
        
        maxHeight: '30%',
        backgroundColor: 'orange',
        "&:nth-child(1), &:nth-child(2), &:nth-child(3)": {
            margin: '70px 0px 0px 0px',
        },
    },
    card: {
        textAlign: 'center',
        wordWrap: "break-word"
    },
    team_name: {
        margin: '0px',
    }
});

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
    padding-bottom: 20px;
    width: 27%;
    height: 350px;
    color: black;
    &:nth-child(1),&:nth-child(2),&:nth-child(3) {
        margin-top: 100px;
    }
`
const MainImage = styled.img`
    flex: 3;
    max-height: 300px;
    max-width: 400px;
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
    margin-top: 5px;
    margin-left: 30px;
    margin-right: 30px;
    font-size: 13px;
    overflow: clip;
    text-overflow: ellipsis;
    maxLine: 3;  
`
const Contents = ({ year }) => {

    const style = useStyles();

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
        <Link key={index}
        to={`/detailpages/${index}`}
        state={{
            id: index,
            contentInfo: doc,
        }}
        className={style.link}
        style={{ textDecoration: 'none' }}
        >
            <Card key={index} className={style.card} >
                <CardContent>
                    <MainImage src={doc.image_url}></MainImage>
                </CardContent>
                <CardHeader title={doc.team_name} className={style.team_name}></CardHeader>
                {/* <CardContent>
                    <TeamDesc>{doc.team_desc}</TeamDesc>
                </CardContent> */}
                
            </Card>
        </Link>
    ));
    
    return (
        <Positioner>
            {list}
        </Positioner>
    );
}

export default Contents;
