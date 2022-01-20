import  { React, useState, useEffect, Children } from 'react';
import styled from 'styled-components';
import { firebase } from "../../firebase";
import { getFirestore, collection, getDocs } from "firebase/firestore";
import { Link } from "react-router-dom";
import { Card, CardHeader, CardContent, CardActions, makeStyles} from "@material-ui/core";

const useStyles = makeStyles({
    card: {
        margin: '10px 0px 10px 0px',
        width: '30%',
        textAlign: 'center',
        maxHeight: '30%',
        "&:nth-child(1), &:nth-child(2), &:nth-child(3)": {
            margin: '100px 0px 0px 0px',
        },
    },
    // link: {
    //     wordWrap: "break-word"
    // },
    team_name: {
        color: 'black',
        margin: '0px',
    }
});

const Positioner = styled.div`
    display: flex;
    justify-content: space-around;
    flex-wrap: wrap;
    width: 100%;
`;

const MainImage = styled.img`
    flex: 3;
    max-height: 200px;
    width: 100%;
    object-fit: contain;
`
const TeamDesc = styled.div`
    flex:2;
    display: block;
    color: black;
    padding: 0px 40px 0px 40px;
    text-overflow: ellipsis;
    word-wrap: break-word;
    overflow: hidden;
    max-height: 3.6em;
    line-height: 1.8em;

`
const Contents = ({ year }) => {

    const style = useStyles();

    const [content, setContent] = useState([]);

    useEffect(() => {
        const FetchContents = async () => {
            const db = getFirestore();
            const data = await getDocs(collection(db, "제품 기획 및 개발"));
        
            setContent(data.docs.map((doc) => ({...doc.data(), id: doc.id})));            
        };
        FetchContents();
    },[])
    
    const list = content.map((doc, index) => (
        
        <Card key={index} className={style.card} >
            <Link key={index}
            to={`/detailpages/${index}`}
            state={{
                id: index,
                contentInfo: doc,
            }}
            className={style.link}
            style={{ textDecoration: 'none' }}
            >
                <CardContent>
                    <MainImage src={doc.image_url}></MainImage>
                </CardContent>
                <CardHeader title={doc.teamName} className={style.team_name}></CardHeader>
                <CardContent>
                    <TeamDesc>{doc.project_description}</TeamDesc>
                </CardContent>
            </Link>
        </Card>
    ));
    
    return (
        <Positioner>
            {list}
        </Positioner>
    );
}

export default Contents;
